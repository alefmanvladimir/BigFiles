import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { StorageProviderMock } from '../wrappers/StorageProviderMock';
import '@ton-community/test-utils';

describe('StorageProviderMock', () => {
    let blockchain: Blockchain;
    let storageProviderMock: SandboxContract<StorageProviderMock>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        storageProviderMock = blockchain.openContract(await StorageProviderMock.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await storageProviderMock.send(
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
            to: storageProviderMock.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and storageProviderMock are ready to use
    });
});
