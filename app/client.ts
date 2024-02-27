import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { InvariantTask, IDL } from "../target/types/invariant_task"
import "dotenv/config"

async function main() {
    anchor.setProvider(anchor.AnchorProvider.env())

    const program = anchor.workspace.InvariantTask as Program<InvariantTask>

    const gmAccount = anchor.web3.Keypair.generate()
    const user = anchor.web3.Keypair.generate()
    const name = "Hastur"

    // const tx = await program.rpc.execute(name, {
    //     accounts: {
    //         gmAccount: gmAccount.publicKey,
    //         user: provider.wallet.publicKey,
    //         systemProgram: anchor.web3.SystemProgram.programId,
    //     },
    //     options: { commitment: "confirmed" },
    //     signers: [gmAccount],
    // })

    const tx = await program.methods.execute(name).accounts({ gmAccount: gmAccount.publicKey }).rpc()

    const storedName = await program.account.greetingAccount.fetch(gmAccount.publicKey)
    console.log(storedName.name)
}

main().then(() => console.log("Done!"))
