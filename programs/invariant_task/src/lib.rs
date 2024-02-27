use anchor_lang::prelude::*;

declare_id!("FH5mcTB7dWgiNjs2JFNRXzyMk587oX7RrZTWtVbPPmFC");

/** @TODO:
    ● Escrow contracts should maintain separate accounts for each user, allowing efficient handling of multiple users simultaneously
    ● Escrow contracts allow for the multi-call of entrypoints: deposit and withdraw.
    ● Only the owner of an account should be able to withdraw funds from their respective escrow account.

    ● Utilize a generic token type (SPL Token, Erc20, PSP22) based on your chosen ecosystem.
    ● Address potential security concerns, particularly vulnerabilities like reentrancy.
    ● Include unit tests.
    ● Bonus points if you add end-to-end tests in TypeScript.
    ● Bonus points if you implement deposit and withdrawal in a single transaction (swap). The swap may have different levels of complexity, e.g., always 1 to 1, AMM, order book,
      depending on your skills.
 */

#[program]
pub mod invariant_task {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = 0;
        msg!("Program Initialized!");
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> Result<()> {        
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        Ok(())
    }
    
    pub fn increment(ctx: Context<Increment>) -> Result<()> {        
        let my_account = &mut ctx.accounts.my_account;
        my_account.data += 1;
        Ok(())
    }
    
    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {        
        let my_account = &mut ctx.accounts.my_account;
        my_account.data -= 1;
        Ok(())
    }

    pub fn execute(ctx: Context<Execute>, name: String) -> Result<()> {
        let gm_account = &mut ctx.accounts.gm_account;
        gm_account.name = name;
        msg!("Hello, {}", gm_account.name);
        Ok(())
    }
}

#[account]
pub struct MyAccount {
    pub data: u64
}

#[account]
pub struct GreetingAccount {
    pub name: String,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(init, payer = user, space = 8 + 32)]
    pub gm_account: Account<'info, GreetingAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>
}

