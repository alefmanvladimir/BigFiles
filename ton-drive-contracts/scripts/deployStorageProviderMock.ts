import { toNano } from 'ton-core';
import { StorageProviderMock } from '../wrappers/StorageProviderMock';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const storageProviderMock = provider.open(await StorageProviderMock.fromInit());

    await storageProviderMock.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(storageProviderMock.address);

    // run methods on `storageProviderMock`
}
