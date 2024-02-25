import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { InvariantTask } from "../target/types/invariant_task"

describe("invariant_task", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env())

    const program = anchor.workspace.InvariantTask as Program<InvariantTask>

    it("Is initialized!", async () => {
        const dataAccountKP = anchor.web3.Keypair.generate()
        const user = anchor.web3.Keypair.generate()

        const tx = program.methods.initialize()
        console.log("Your transaction signature: ", tx)

        const updateTx = program.methods.update(new anchor.BN(77)).accounts({ myAccount: dataAccountKP.publicKey })
        console.log("Update Performed!", updateTx)
    })
})
