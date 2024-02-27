import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { InvariantTask } from "../target/types/invariant_task"
import { Keypair } from "@solana/web3.js"
import { assert } from "chai"

describe("invariant_task", async () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env())

    const program = anchor.workspace.InvariantTask as Program<InvariantTask>

    // Declaring new accounts
    let dataAccountKP: Keypair
    let user: Keypair

    // Creating new accounts
    dataAccountKP = anchor.web3.Keypair.generate()
    user = anchor.web3.Keypair.generate()

    const connection = anchor.getProvider().connection
    const befBal = await connection.getBalance(dataAccountKP.publicKey)
    const befUserBal = await connection.getBalance(user.publicKey)
    console.log(`Accounts Balance: ${befBal} and User: ${befUserBal}`)

    await connection.requestAirdrop(dataAccountKP.publicKey, 1000)
    await connection.requestAirdrop(user.publicKey, 1000)

    const postBal = await connection.getBalance(dataAccountKP.publicKey)
    const postUserBal = await connection.getBalance(user.publicKey)

    console.log(`Accounts Balance: ${postBal} and User: ${postUserBal}`)
    //await program.methods.initialize()

    // Fetch newly created account from cluster
    //const account = await program.account.myAccount.fetch(myAccount.publicKey)

    // Check it's state was initialized
    //assert.ok(account.data.eq(new anchor BN(0)))

    //_myAccount = myAccount

    console.log("Initial Acc: ", dataAccountKP.publicKey)

    describe("Initialize", () => {
        it("Initializes contract correctly", async () => {
            const tx = program.methods
                .initialize()
                .accounts({ myAccount: dataAccountKP.publicKey, signer: user.publicKey, systemProgram: anchor.web3.SystemProgram.programId })
                .signers([dataAccountKP])
                .rpc()

            assert(tx)
        })
    })
    // describe("Update", () => {
    //     it("Updates account data correctly", async () => {
    //         console.log("Update Acc: ", dataAccountKP.publicKey)
    //         const acc = await program.account.myAccount.fetch(dataAccountKP.publicKey)
    //         assert.equal(acc.data, 0)

    //         const updateTx = program.methods.update(new anchor.BN(77)).accounts({ myAccount: dataAccountKP.publicKey }).signers([dataAccountKP]).rpc()
    //         assert(updateTx)
    //         assert.equal(acc.data, 77)
    //     })
    // })
    // describe("Increment", () => {
    //     it("Increment account data by one", async () => {
    //         const tx = program.methods.initialize()
    //         assert(tx)

    //         const acc = await program.account.myAccount.fetch(dataAccountKP.publicKey)
    //         console.log(`Acc Data: ${acc.data}`)
    //     })
    // })
    describe("Decrement", () => {
        it("Decrements account data by one", async () => {
            const tx = program.methods.initialize()

            assert(tx)
        })
    })
    describe("Execute", () => {
        it("Creates welcome message", async () => {
            const gmAccount = anchor.web3.Keypair.generate()
            const user = anchor.web3.Keypair.generate()
            const name = "Hastur"

            await program.methods
                .initialize()
                .accounts({ myAccount: gmAccount.publicKey, signer: user.publicKey, systemProgram: anchor.web3.SystemProgram.programId })
                .signers([gmAccount, user])
                .rpc()

            // Airdrop SOL to pool account PDA

            const tx = await program.methods.execute(name).accounts({ gmAccount: gmAccount.publicKey }).rpc()

            const storedName = await program.account.greetingAccount.fetch(gmAccount.publicKey)
            console.log(storedName.name)
        })
    })
})
