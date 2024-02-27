import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { InvariantTask, IDL } from "../target/types/invariant_task"
import "dotenv/config"

/** @dev Added just for testing purposes if ts-node works */
;(async () => {
    anchor.setProvider(anchor.AnchorProvider.env())

    const program = anchor.workspace.InvariantTask as Program<InvariantTask>

    const tx = program.methods.initialize()
    console.log(`Your transaction signature is: ${tx}`)
})()

/** @dev Manual Connection */
// import { Keypair, Connection } from "@solana/web3.js"
// import fs from "fs"
// import { IDL } from "../target/types/invariant_task"
// ;(async () => {
//     const connection = new Connection("http://localhost:8899")
//     const secret = JSON.parse(fs.readFileSync("/home/niferu/.config/solana/id.json").toString())
//     const keypair = Keypair.fromSecretKey(new Uint8Array(secret))
//     const wallet = new anchor.Wallet(keypair)
//     const provider = new anchor.AnchorProvider(connection, wallet, {})
//     const program = new Program<InvariantTask>(IDL, "H3MzbSxhjW7uoW1Bqae4iNmq743KN3SjSHwcRPDdxsAq", provider)

//     const tx = await program.methods.initialize().rpc()
//     console.log(`Your transaction signature is: ${tx}`)
// })()
