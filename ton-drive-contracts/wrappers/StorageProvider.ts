import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type StorageProviderConfig = {};

export function storageProviderConfigToCell(config: StorageProviderConfig): Cell {
    return beginCell().endCell();
}

export class StorageProvider implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StorageProvider(address);
    }

    static createFromConfig(config: StorageProviderConfig, code: Cell, workchain = 0) {
        const data = storageProviderConfigToCell(config);
        const init = { code, data };
        return new StorageProvider(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
