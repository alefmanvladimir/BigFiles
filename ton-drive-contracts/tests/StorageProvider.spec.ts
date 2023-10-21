import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { StorageProvider } from '../wrappers/StorageProvider';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('StorageProvider', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('StorageProvider');
    });

    let blockchain: Blockchain;
    let storageProvider: SandboxContract<StorageProvider>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        storageProvider = blockchain.openContract(StorageProvider.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await storageProvider.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: storageProvider.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and storageProvider are ready to use
    });
});
