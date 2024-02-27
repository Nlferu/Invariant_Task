# Example of Escrow Contract

## Blockchain

-   Solana

## Network

-   Localhost

## Language

-   Rust
-   Type Script

## Framework

-   Anchor

## Escrow contract

    ● Maintains separate accounts for each user, allowing efficient handling of multiple users simultaneously
    ● Allows for the multi-call of entrypoints: deposit and withdraw in single transaction (swap).
    ● Only the owner of an account should be able to withdraw funds from their respective escrow account.
    ● Utilizing a generic token type (SPL Token, Erc20, PSP22) based on your chosen ecosystem.
    ● Address potential security concerns, particularly vulnerabilities like reentrancy.
    ● Includes end-to-end unit tests using type script.

![alt text](acc_relations.png)

## Structure

### Initialize

Initializer can send a tx to the escrow program to setup the Vault. In this tx, two new accounts: Vault and EscrowAccount, will be created and tokens (Token A) to be exchanged will be transfered from Initializer to Vault.

#### Initialize Structure:

-   Processor - Main buisiness logic locates in processor
-   Instructions (Account Context) - Instruction data packing/unpacking and account constraints and access control locate in Instruction handling part
-   Account - Declaration of account owned by program locates in account part

### Cancel

Initializer can also send a tx to escrow program to cancel its demand. The tokens will be transfered back to the Initialzer and both Vault and EscrowAccount will be closed in this case.

### Exchange

Taker can send a tx to the escrow to exchange Token B for Token A. First, tokens (Token B) will be transfered from Taker to Initializer. Afterward, the tokens (Token A) kept in the Vault will be transfered to Taker. Finally, both Vault and EscrowAccount will be closed.
