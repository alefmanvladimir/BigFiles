import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { TonDriveMaster } from '../wrappers/TonDriveMaster';
import '@ton-community/test-utils';
import {toNano} from "ton-core";

describe('TonDriveMaster', () => {
    let blockchain: Blockchain;
    let tonDriveMaster: SandboxContract<TonDriveMaster>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tonDriveMaster = blockchain.openContract(await TonDriveMaster.fromInit());
    });

    it('should deploy', async () => {
        const deployer = await blockchain.treasury('deployer');
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
        const balance = (await blockchain.getContract(tonDriveMaster.address)).balance

        const collectionAddress = await tonDriveMaster.getUserCollectionAddress(deployer.getSender().address)
        expect(collectionAddress).not.toBeNull()
        expect(balance).toBe(0n)
    });
});
