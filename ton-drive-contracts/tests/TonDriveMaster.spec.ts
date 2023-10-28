import {
    Blockchain,
    prettyLogTransactions,
    printTransactionFees,
    SandboxContract,
    TreasuryContract
} from '@ton-community/sandbox';
import {TonDriveMaster} from '../wrappers/TonDriveMaster';
import '@ton-community/test-utils';
import {fromNano, toNano} from "ton-core";

describe('TonDriveMaster', () => {
    let blockchain: Blockchain;
    let tonDriveMaster: SandboxContract<TonDriveMaster>;
    let deployer: SandboxContract<TreasuryContract>

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tonDriveMaster = blockchain.openContract(await TonDriveMaster.fromInit());

        deployer = await blockchain.treasury('deployer');
        await tonDriveMaster.send(
            deployer.getSender(),
            {
                value: toNano("0.1")
            },
            {
                $$type: 'Deploy',
                queryId: 0n
            }
        )
    });

    it('should deploy', async () => {

        const balance = (await blockchain.getContract(tonDriveMaster.address)).balance

        const collectionAddress = await tonDriveMaster.getUserCollectionAddress(deployer.getSender().address)
        expect(collectionAddress).not.toBeNull()
        expect(balance).toBe(0n)
    });

    it('should create collection', async () => {
        const user = await blockchain
            .treasury("user", {balance: toNano(10)})
        const collectionAddress = await tonDriveMaster.getUserCollectionAddress(user.getSender().address)
        let res = await tonDriveMaster.send(
            user.getSender(),
            {
                value: toNano("5")
            },
            'create_collection'
        )
        const collectionContract = blockchain.openContract(await blockchain.getContract(collectionAddress))
        expect(collectionContract.accountState?.type).toBe("active")
        console.log("Collection: ", fromNano(collectionContract.balance))
        console.log("Master: ", fromNano((await blockchain.getContract(tonDriveMaster.address)).balance))
        const userBalance = await user.getBalance()
        console.log("User: ", fromNano(userBalance))
        printTransactionFees(res.transactions)
    });
});
