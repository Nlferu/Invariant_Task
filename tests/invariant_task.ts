import * as anchor from "@coral-xyz/anchor"
import * as splToken from "@solana/spl-token"
import { Program } from "@coral-xyz/anchor"
import { InvariantTask } from "../target/types/invariant_task"
import { LAMPORTS_PER_SOL, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import { assert } from "chai"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet"
import { Keypair } from "@solana/web3.js"

describe("invariant_task", () => {
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.InvariantTask as Program<InvariantTask>

    const seller = provider.wallet.publicKey
    console.log(`Seller: `, seller.toString())
    const payer = (provider.wallet as NodeWallet).payer
    console.log(`Payer: `, payer.publicKey.toString())

    const buyer = anchor.web3.Keypair.generate()
    console.log(`Buyer: `, buyer.publicKey.toString())

    const escrowedXTokens = anchor.web3.Keypair.generate()
    console.log(`escrowedXTokens: `, escrowedXTokens.publicKey.toString())

    let x_mint = undefined
    let y_mint = undefined
    let sellers_x_token = undefined
    let sellers_y_token = undefined
    let buyer_x_token = undefined
    let buyer_y_token = undefined
    let escrow: anchor.web3.PublicKey

    before(async () => {
        await provider.connection.requestAirdrop(buyer.publicKey, 1 * LAMPORTS_PER_SOL)
        ;[escrow] = anchor.web3.PublicKey.findProgramAddressSync([anchor.utils.bytes.utf8.encode("escrow6"), seller.toBuffer()], program.programId)
        // Get the amount of SOL needed to pay rent for our Token Mint
        const lamports: number = await program.provider.connection.getMinimumBalanceForRentExemption(splToken.MINT_SIZE)

        x_mint = await splToken.createMint(provider.connection, payer, provider.wallet.publicKey, provider.wallet.publicKey, 6)
        console.log(`x_mint: `, x_mint.toString())

        y_mint = await splToken.createMint(provider.connection, payer, provider.wallet.publicKey, null, 6)
        console.log(`y_mint: `, y_mint.toString())

        // Seller x and y token account
        // sellers_x_token = anchor.web3.SystemProgram.createAccount({
        //     fromPubkey: x_mint,
        //     newAccountPubkey: seller,
        //     space: splToken.MINT_SIZE,
        //     programId: splToken.TOKEN_PROGRAM_ID,
        //     lamports,
        // })
        // console.log(`sellers_x_token: `, sellers_x_token.toString())

        // //await x_mint.splToken.mintTo(sellers_x_token, payer, [], 10_000_000_000)

        // sellers_y_token = await y_mint.createAccount(
        //     anchor.web3.SystemProgram.createAccount({
        //         fromPubkey: y_mint,
        //         newAccountPubkey: seller,
        //         space: splToken.MINT_SIZE,
        //         programId: splToken.TOKEN_PROGRAM_ID,
        //         lamports,
        //     })
        // )
        // console.log(`sellers_y_token: `, sellers_y_token.toString())

        // Buyer x and y token account
        // buyer_x_token = await x_mint.createAccount(
        //     anchor.web3.SystemProgram.createAccount({
        //         fromPubkey: x_mint,
        //         newAccountPubkey: buyer.publicKey,
        //         space: splToken.MINT_SIZE,
        //         programId: splToken.TOKEN_PROGRAM_ID,
        //         lamports,
        //     })
        // )
        // console.log(`buyer_x_token: `, buyer_x_token.toString())

        // buyer_y_token = await y_mint.createAccount(
        //     anchor.web3.SystemProgram.createAccount({
        //         fromPubkey: y_mint,
        //         newAccountPubkey: buyer.publicKey,
        //         space: splToken.MINT_SIZE,
        //         programId: splToken.TOKEN_PROGRAM_ID,
        //         lamports,
        //     })
        // )
        // console.log(`buyer_y_token: `, buyer_y_token.toString())

        //await y_mint.mintTo(buyer_y_token, payer, [], 10_000_000_000)
    })

    it("Initialize escrow", async () => {
        // const x_amount = new anchor.BN(40)
        // const y_amount = new anchor.BN(40)
        // console.log("sellers_x_token: ", sellers_x_token)
        // const tx = await program.methods
        //     .initialize(x_amount, y_amount)
        //     .accounts({
        //         seller: seller,
        //         xMint: x_mint,
        //         yMint: y_mint,
        //         sellerXToken: sellers_x_token,
        //         escrow: escrow,
        //         escrowedXTokens: escrowedXTokens.publicKey,
        //         tokenProgram: splToken.TOKEN_PROGRAM_ID,
        //         rent: SYSVAR_RENT_PUBKEY,
        //         systemProgram: anchor.web3.SystemProgram.programId,
        //     })
        //     .signers([escrowedXTokens])
        //     .rpc({ skipPreflight: true })
        // console.log("TxSig :: ", tx)
    })

    it("Exchange", async () => {
        // const tx = await program.methods
        //     .exchange()
        //     .accounts({
        //         buyer: buyer.publicKey,
        //         escrow: escrow,
        //         escrowedXTokens: escrowedXTokens.publicKey,
        //         sellersYTokens: sellers_y_token,
        //         buyerXTokens: buyer_x_token,
        //         buyerYTokens: buyer_y_token,
        //         tokenProgram: splToken.TOKEN_PROGRAM_ID,
        //     })
        //     .signers([buyer])
        //     .rpc({ skipPreflight: true })
    })

    it("Cancel the trade", async () => {
        // const tx = await program.methods
        //     .cancel()
        //     .accounts({
        //         seller: seller,
        //         escrow: escrow,
        //         escrowedXTokens: escrowedXTokens.publicKey,
        //         sellerXToken: sellers_x_token,
        //         tokenProgram: splToken.TOKEN_PROGRAM_ID,
        //     })
        //     .rpc({ skipPreflight: true })
    })
})
