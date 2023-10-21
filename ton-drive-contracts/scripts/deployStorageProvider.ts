import { toNano } from 'ton-core';
import { StorageProvider } from '../wrappers/StorageProvider';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const storageProvider = provider.open(StorageProvider.createFromConfig({}, await compile('StorageProvider')));

    await storageProvider.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(storageProvider.address);

    // run methods on `storageProvider`
}
