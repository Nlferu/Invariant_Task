use anchor_lang::prelude::*;

declare_id!("H3MzbSxhjW7uoW1Bqae4iNmq743KN3SjSHwcRPDdxsAq");

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
}

#[account]
pub struct MyAccount {
    data: u64
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
