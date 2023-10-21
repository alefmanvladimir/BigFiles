import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { TonDriveCollectionItem } from '../wrappers/TonDriveCollectionItem';
import '@ton-community/test-utils';

describe('TonDriveCollectionItem', () => {
    let blockchain: Blockchain;
    let tonDriveCollectionItem: SandboxContract<TonDriveCollectionItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tonDriveCollectionItem = blockchain.openContract(await TonDriveCollectionItem.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await tonDriveCollectionItem.send(
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
            to: tonDriveCollectionItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tonDriveCollectionItem are ready to use
    });
});
