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

    pub fn initialize(
        ctx: Context<Initialize>,
        _vault_account_bump: u8,
        initializer_amount: u64,
        taker_amount: u64,
    ) -> ProgramResult {
        // TODO
        Ok(())
    }

    pub fn cancel(ctx: Context<Cancel>) -> ProgramResult {
        // TODO
        Ok(())
    }

    pub fn exchange(ctx: Context<Exchange>) -> ProgramResult {
        // TODO
        Ok(())
    }
}
