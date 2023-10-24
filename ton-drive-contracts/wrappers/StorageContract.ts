import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type StorageContractConfig = {};

export function storageContractConfigToCell(config: StorageContractConfig): Cell {
    return beginCell().endCell();
}

export class StorageContract implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new StorageContract(address);
    }

    static createFromConfig(config: StorageContractConfig, code: Cell, workchain = 0) {
        const data = storageContractConfigToCell(config);
        const init = { code, data };
        return new StorageContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
