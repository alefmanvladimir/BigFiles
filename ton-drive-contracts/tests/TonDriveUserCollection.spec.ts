import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { TonDriveUserCollection } from '../wrappers/TonDriveUserCollection';
import '@ton-community/test-utils';

describe('TonDriveUserCollection', () => {
    let blockchain: Blockchain;
    let tonDriveUserCollection: SandboxContract<TonDriveUserCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tonDriveUserCollection = blockchain.openContract(await TonDriveUserCollection.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await tonDriveUserCollection.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonDriveUserCollection.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tonDriveUserCollection are ready to use
    });
});
