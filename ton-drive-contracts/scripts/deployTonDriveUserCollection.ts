import { toNano } from 'ton-core';
import { TonDriveUserCollection } from '../wrappers/TonDriveUserCollection';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const tonDriveUserCollection = provider.open(await TonDriveUserCollection.fromInit());

    await tonDriveUserCollection.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tonDriveUserCollection.address);

    // run methods on `tonDriveUserCollection`
}
