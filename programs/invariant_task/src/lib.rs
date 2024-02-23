use anchor_lang::prelude::*;

declare_id!("H3MzbSxhjW7uoW1Bqae4iNmq743KN3SjSHwcRPDdxsAq");

#[program]
pub mod invariant_task {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Installation Succeeded!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
