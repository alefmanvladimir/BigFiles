import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { TonDriveMaster } from '../wrappers/TonDriveMaster';
import '@ton-community/test-utils';

describe('TonDriveMaster', () => {
    let blockchain: Blockchain;
    let tonDriveMaster: SandboxContract<TonDriveMaster>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tonDriveMaster = blockchain.openContract(await TonDriveMaster.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await tonDriveMaster.send(
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
            to: tonDriveMaster.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tonDriveMaster are ready to use
    });
});
