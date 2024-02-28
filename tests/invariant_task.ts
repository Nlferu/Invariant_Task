import * as anchor from "@coral-xyz/anchor"
import * as splToken from "@solana/spl-token"
import { Program } from "@coral-xyz/anchor"
import { InvariantTask } from "../target/types/invariant_task"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet"
import { assert } from "chai"
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
    })

    it("Initialize escrow", async () => {})

    it("Exchange", async () => {})

    it("Cancel the trade", async () => {})
})
