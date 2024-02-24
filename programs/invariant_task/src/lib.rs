use anchor_lang::prelude::*;

declare_id!("H3MzbSxhjW7uoW1Bqae4iNmq743KN3SjSHwcRPDdxsAq");

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
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>
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
