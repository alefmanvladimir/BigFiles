import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { StorageContract } from '../wrappers/StorageContract';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('StorageContract', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('StorageContract');
    });

    let blockchain: Blockchain;
    let storageContract: SandboxContract<StorageContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        storageContract = blockchain.openContract(StorageContract.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await storageContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: storageContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and storageContract are ready to use
    });
});
