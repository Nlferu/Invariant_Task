use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

declare_id!("GcTaCXUPXxLbaoTuFtzv3xg6wL7VB4Xq1WsjADwdDPJQ");

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

    // This function is creating new escrow (selling x_token for y_token)
    pub fn initialize(ctx: Context<Initialize>, x_amount: u64, y_amount: u64) -> Result<()> {
        // This line retrieves a value associated with the key "escrow" from a map called bumps in the context ctx
        // Unwraps the Option to get the actual value, and assigns it to the bump field of the escrow variable.
        let escrow = &mut ctx.accounts.escrow;
        escrow.bump = ctx.bumps.escrow;
        // Our signer
        escrow.authority = ctx.accounts.seller.key();
        // It retrieves publicKey for escrowed_x_tokens acc and assigns it to escrowed_x_tokens variable
        escrow.escrowed_x_tokens = ctx.accounts.escrowed_x_tokens.key();
        // Number of token sellers wants in exchange
        escrow.y_amount = y_amount;
        // Token seller wants in exchange
        escrow.y_mint = ctx.accounts.y_mint.key();

        // Transfer seller's x_token in program owned escrow token account to initialize whole process
        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.seller_x_token.to_account_info(),
                    to: ctx.accounts.escrowed_x_tokens.to_account_info(),
                    authority: ctx.accounts.seller.to_account_info(),
                },
            ),
            x_amount,
        )?;
        Ok(())
    }

    // This function allows buyer to exchange y_token for x_token from open escrow
    pub fn exchange(ctx: Context<Exchange>) -> Result<()> {
        // transfer escrowd_x_token to buyer
        anchor_spl::token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.escrowed_x_tokens.to_account_info(),
                    to: ctx.accounts.buyer_x_tokens.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                },
                &[&["escrow".as_bytes(), ctx.accounts.escrow.authority.as_ref(), &[ctx.accounts.escrow.bump]]],
            ),
            ctx.accounts.escrowed_x_tokens.amount,
        )?;
    
    
        // Transfer buyer's y_token to seller
        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.buyer_y_tokens.to_account_info(),
                    to: ctx.accounts.sellers_y_tokens.to_account_info(),
                    authority: ctx.accounts.buyer.to_account_info(),
                },
            ),
            ctx.accounts.escrow.y_amount,
        )?;
        Ok(())
    }
    
    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        // Return seller's x_token back
        anchor_spl::token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.escrowed_x_tokens.to_account_info(),
                    to: ctx.accounts.seller_x_token.to_account_info(),
                    authority: ctx.accounts.escrow.to_account_info(),
                },
                &[&["escrow6".as_bytes(), ctx.accounts.seller.key().as_ref(), &[ctx.accounts.escrow.bump]]],
            ),
            ctx.accounts.escrowed_x_tokens.amount,
        )?;
    
        // Close account
        anchor_spl::token::close_account(CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::CloseAccount {
                account: ctx.accounts.escrowed_x_tokens.to_account_info(),
                destination: ctx.accounts.seller.to_account_info(),
                authority: ctx.accounts.escrow.to_account_info(),
            },
            &[&["escrow6".as_bytes(), ctx.accounts.seller.key().as_ref(), &[ctx.accounts.escrow.bump]]],
        ))?;
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // Seller willing to sell his token_x for token_y
    #[account(mut)]
    seller: Signer<'info>,

    // Token x mint for ex. USDC
    x_mint: Account<'info, Mint>,
    // Token y mint 
    y_mint: Account<'info, Mint>,

    // ATA of x_mint 
    #[account(mut, constraint = seller_x_token.mint == x_mint.key() && seller_x_token.owner == seller.key())] 
    seller_x_token: Account<'info, TokenAccount>,

    #[account(
        init, 
        payer = seller,  
        space=Escrow::INIT_SPACE,
        seeds = ["escrow6".as_bytes(), seller.key().as_ref()],
        bump,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = seller,
        token::mint = x_mint,
        token::authority = escrow,
    )]
    escrowed_x_tokens: Account<'info, TokenAccount>,

    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Exchange<'info> {
    pub buyer: Signer<'info>,

    #[account(mut, seeds = ["escrow".as_bytes(), escrow.authority.as_ref()], bump = escrow.bump,)]
    pub escrow: Account<'info, Escrow>,

    #[account(mut, constraint = escrowed_x_tokens.key() == escrow.escrowed_x_tokens)]
    pub escrowed_x_tokens: Account<'info, TokenAccount>,

    #[account(mut, constraint = sellers_y_tokens.mint == escrow.y_mint)]
    pub sellers_y_tokens: Account<'info, TokenAccount>,

    #[account(mut, constraint = buyer_x_tokens.mint == escrowed_x_tokens.mint)]
    pub buyer_x_tokens: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = buyer_y_tokens.mint == escrow.y_mint,
        constraint = buyer_y_tokens.owner == buyer.key()
    )]
    pub buyer_y_tokens: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Cancel<'info> {
    pub seller: Signer<'info>,
    #[account(
        mut,
        close = seller, constraint = escrow.authority == seller.key(),
        seeds = ["escrow".as_bytes(), escrow.authority.as_ref()],
        bump = escrow.bump,
    )]
    pub escrow: Account<'info, Escrow>,
    #[account(mut, constraint = escrowed_x_tokens.key() == escrow.escrowed_x_tokens)]
    pub escrowed_x_tokens: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = seller_x_token.mint == escrowed_x_tokens.mint,
        constraint = seller_x_token.owner == seller.key()
    )]
    seller_x_token: Account<'info, TokenAccount>,
    token_program: Program<'info, Token>,
}

#[account]
pub struct Escrow {
    authority: Pubkey,
    bump: u8,
    escrowed_x_tokens: Pubkey,
    y_mint: Pubkey,
    y_amount: u64,
}


impl Escrow {
    pub const INIT_SPACE: usize = 8 + 1+ 32 + 32 + 32 + 8;
}
