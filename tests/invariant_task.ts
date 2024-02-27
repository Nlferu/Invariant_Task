import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { InvariantTask } from "../target/types/invariant_task"
import { Keypair } from "@solana/web3.js"
import { assert, expect } from "chai"

describe("invariant_task", async () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)
    const devil = provider.wallet
    const program = anchor.workspace.InvariantTask as Program<InvariantTask>

    // Creating new account
    const dataAccountKP = anchor.web3.Keypair.generate()

    it("Initializes contract and account correctly", async () => {
        await program.methods
            .initialize()
            .accounts({ myAccount: dataAccountKP.publicKey, signer: devil.publicKey, systemProgram: anchor.web3.SystemProgram.programId })
            .signers([dataAccountKP])
            .rpc()

        const storedAccountData = await program.account.myAccount.fetch(dataAccountKP.publicKey)
        console.log("Account Stored Data: ", storedAccountData.data.toNumber())
        assert.equal(storedAccountData.data.toNumber(), 0)
    })
    it("Updates account data correctly", async () => {
        await program.methods.update(new anchor.BN(77)).accounts({ myAccount: dataAccountKP.publicKey }).rpc()

        const storedAccountData = await program.account.myAccount.fetch(dataAccountKP.publicKey)
        console.log("Updated Account Stored Data: ", storedAccountData.data.toNumber())
        assert.equal(storedAccountData.data.toNumber(), 77)
    })
    it("Increments data on account by 1 correctly", async () => {
        await program.methods.increment().accounts({ myAccount: dataAccountKP.publicKey }).rpc()

        const storedAccountData = await program.account.myAccount.fetch(dataAccountKP.publicKey)
        console.log("Incremented Account Stored Data: ", storedAccountData.data.toNumber())
        assert.equal(storedAccountData.data.toNumber(), 78)
    })
    it("Decrements data on account by 1 correctly", async () => {
        await program.methods.decrement().accounts({ myAccount: dataAccountKP.publicKey }).rpc()

        const storedAccountData = await program.account.myAccount.fetch(dataAccountKP.publicKey)
        console.log("Decremented Account Stored Data: ", storedAccountData.data.toNumber())
        assert.equal(storedAccountData.data.toNumber(), 77)
    })
    it("Executes welcome message correctly", async () => {
        // Example funding account
        const prevDevilBalance = await provider.connection.getBalance(devil.publicKey)
        const airdropSignature = await provider.connection.requestAirdrop(devil.publicKey, 2750)
        const latestBlockHash = await provider.connection.getLatestBlockhash()
        await provider.connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature,
        })

        const postDevilBalance = await provider.connection.getBalance(devil.publicKey)
        console.log(`Starting Devil Balance: ${prevDevilBalance} Post Devil Balance: ${postDevilBalance}`)

        const gmAccount = anchor.web3.Keypair.generate()
        const name = "Anu"

        await program.methods
            .execute(name)
            .accounts({ gmAccount: gmAccount.publicKey, user: devil.publicKey, systemProgram: anchor.web3.SystemProgram.programId })
            .signers([gmAccount])
            .rpc()

        const storedName = await program.account.greetingAccount.fetch(gmAccount.publicKey)
        console.log("User Name Is: ", storedName.name)

        assert.equal(storedName.name, name)
    })
})
