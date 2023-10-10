import { toNano } from 'ton-core';
import { TonDriveMaster } from '../wrappers/TonDriveMaster';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const tonDriveMaster = provider.open(await TonDriveMaster.fromInit());

    await tonDriveMaster.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tonDriveMaster.address);

    // run methods on `tonDriveMaster`
}
