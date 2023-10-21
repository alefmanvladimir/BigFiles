import { toNano } from 'ton-core';
import { DriveMaster } from '../wrappers/DriveMaster';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const driveMaster = provider.open(await DriveMaster.fromInit());

    await driveMaster.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(driveMaster.address);

    // run methods on `driveMaster`
}
