import { toNano } from 'ton-core';
import { StorageContract } from '../wrappers/StorageContract';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const storageContract = provider.open(StorageContract.createFromConfig({}, await compile('StorageContract')));

    await storageContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(storageContract.address);

    // run methods on `storageContract`
}
