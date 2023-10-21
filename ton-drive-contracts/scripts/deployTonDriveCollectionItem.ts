import { toNano } from 'ton-core';
import { TonDriveCollectionItem } from '../wrappers/TonDriveCollectionItem';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const tonDriveCollectionItem = provider.open(await TonDriveCollectionItem.fromInit());

    await tonDriveCollectionItem.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tonDriveCollectionItem.address);

    // run methods on `tonDriveCollectionItem`
}
