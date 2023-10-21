import { toNano } from 'ton-core';
import { DriveChildy } from '../wrappers/DriveChildy';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const driveChildy = provider.open(await DriveChildy.fromInit());

    await driveChildy.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(driveChildy.address);

    // run methods on `driveChildy`
}
