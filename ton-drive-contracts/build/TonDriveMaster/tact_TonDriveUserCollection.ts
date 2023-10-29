import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type FileInfo = {
    $$type: 'FileInfo';
    storageContractAddress: Address | null;
    closed: boolean;
    fileSize: bigint;
    name: string;
    created: bigint;
}

export function storeFileInfo(src: FileInfo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.storageContractAddress);
        b_0.storeBit(src.closed);
        b_0.storeInt(src.fileSize, 257);
        b_0.storeStringRefTail(src.name);
        b_0.storeInt(src.created, 257);
    };
}

export function loadFileInfo(slice: Slice) {
    let sc_0 = slice;
    let _storageContractAddress = sc_0.loadMaybeAddress();
    let _closed = sc_0.loadBit();
    let _fileSize = sc_0.loadIntBig(257);
    let _name = sc_0.loadStringRefTail();
    let _created = sc_0.loadIntBig(257);
    return { $$type: 'FileInfo' as const, storageContractAddress: _storageContractAddress, closed: _closed, fileSize: _fileSize, name: _name, created: _created };
}

function loadTupleFileInfo(source: TupleReader) {
    let _storageContractAddress = source.readAddressOpt();
    let _closed = source.readBoolean();
    let _fileSize = source.readBigNumber();
    let _name = source.readString();
    let _created = source.readBigNumber();
    return { $$type: 'FileInfo' as const, storageContractAddress: _storageContractAddress, closed: _closed, fileSize: _fileSize, name: _name, created: _created };
}

function storeTupleFileInfo(source: FileInfo) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.storageContractAddress);
    builder.writeBoolean(source.closed);
    builder.writeNumber(source.fileSize);
    builder.writeString(source.name);
    builder.writeNumber(source.created);
    return builder.build();
}

function dictValueParserFileInfo(): DictionaryValue<FileInfo> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeFileInfo(src)).endCell());
        },
        parse: (src) => {
            return loadFileInfo(src.loadRef().beginParse());
        }
    }
}

export type Create = {
    $$type: 'Create';
    payload: Cell;
    storageProviderAddress: Address | null;
    name: string;
}

export function storeCreate(src: Create) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1563101277, 32);
        b_0.storeRef(src.payload);
        b_0.storeAddress(src.storageProviderAddress);
        b_0.storeStringRefTail(src.name);
    };
}

export function loadCreate(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1563101277) { throw Error('Invalid prefix'); }
    let _payload = sc_0.loadRef();
    let _storageProviderAddress = sc_0.loadMaybeAddress();
    let _name = sc_0.loadStringRefTail();
    return { $$type: 'Create' as const, payload: _payload, storageProviderAddress: _storageProviderAddress, name: _name };
}

function loadTupleCreate(source: TupleReader) {
    let _payload = source.readCell();
    let _storageProviderAddress = source.readAddressOpt();
    let _name = source.readString();
    return { $$type: 'Create' as const, payload: _payload, storageProviderAddress: _storageProviderAddress, name: _name };
}

function storeTupleCreate(source: Create) {
    let builder = new TupleBuilder();
    builder.writeCell(source.payload);
    builder.writeAddress(source.storageProviderAddress);
    builder.writeString(source.name);
    return builder.build();
}

function dictValueParserCreate(): DictionaryValue<Create> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeCreate(src)).endCell());
        },
        parse: (src) => {
            return loadCreate(src.loadRef().beginParse());
        }
    }
}

export type CloseItem = {
    $$type: 'CloseItem';
    torrentHash: bigint;
}

export function storeCloseItem(src: CloseItem) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(515883932, 32);
        b_0.storeInt(src.torrentHash, 257);
    };
}

export function loadCloseItem(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 515883932) { throw Error('Invalid prefix'); }
    let _torrentHash = sc_0.loadIntBig(257);
    return { $$type: 'CloseItem' as const, torrentHash: _torrentHash };
}

function loadTupleCloseItem(source: TupleReader) {
    let _torrentHash = source.readBigNumber();
    return { $$type: 'CloseItem' as const, torrentHash: _torrentHash };
}

function storeTupleCloseItem(source: CloseItem) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.torrentHash);
    return builder.build();
}

function dictValueParserCloseItem(): DictionaryValue<CloseItem> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeCloseItem(src)).endCell());
        },
        parse: (src) => {
            return loadCloseItem(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

 type TonDriveUserCollection_init_args = {
    $$type: 'TonDriveUserCollection_init_args';
    owner: Address;
}

function initTonDriveUserCollection_init_args(src: TonDriveUserCollection_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
    };
}

async function TonDriveUserCollection_init(owner: Address) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('te6cckECIwEABy8AAQHAAQEFoYkTAgEU/wD0pBP0vPLICwMCAWIPBAIBIAoFAgEgCQYCAUgIBwB1sm7jQ1aXBmczovL1FtWFVFckZUOThlQnNvazJTTndwSzlYZ3dWR29yeXdHcm01TEQzcmFTbWRqeTiCAAEbCvu1E0NIAAYAC5u70YJwXOw9XSyuex6E7DnWSoUbZoJwndY1LStkfLMi068t/fFiOYJwIFXAG4BnY5TOWDquRyWyw4JwnZdOWrNOy3M6DpZtlGbopIJwQM51aecV+dJQsB1hbiZHsoAgEgDQsCEbhR3bPNs8bCGCEMAAIhAhG41o2zzbPGwhghDgACIALU0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8Wts88uCCyPhDAcx/AcoAWVkg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxb0AMntVCEQBPTtou37AZIwf+BwIddJwh+VMCDXCx/eIIIQXSsIXbqOxTDTHwGCEF0rCF268uCB1PpAIdcLAcMAjh0BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJIxbeIB1AHQQzBsE9s8f+AgghAev8OcuuMCIIIQlGqYtrrjAhwaGBEE2sAAj+gg+QEggvBKqBkBdIK3h3XxtFabgD1yVJNhNS2SUE9JvdVmX1XN4rqUW3/bMeCC8HzQSs2PzGbLTM8wXveCRyMd85PrnZAonkcM4CsstAMGuo+VMNs8cIEAgogkVSB/VTBtbds8f9sx4N4gFx4SAurTHyGCEL970MG6juYx0z8x0/8wIYMHIln0D2+hkjBt3yBukjBtjkPQ+kAh1wsBwwCOHQEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIkjFt4gHSAIEBAdcA1AHQAYEBAdcAVUBsFW8F4iBus5Fb4w3jDn8VEwHkAYIQtiNtY7qO5dM/MdP/MCGDByJZ9A9voZIwbd8gbpIwbY5D0PpAIdcLAcMAjh0BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJIxbeIB0gCBAQHXANQB0AGBAQHXAFVAbBVvBeIgbrORW+MNkTDiFAH0gwchIG7y0IBvJV8EIiBu8tCAbyUQJF8EIyBu8tCAbyUUXwR/BSBu8tCAbyVsQRA0QTAVQzDIVUBQVCBulTBwAcsBjh4g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbiEsoAgQEBzwDIUAPPFslYzIEBAc8AyRIWAeSDB/hCIiBu8tCAbyUQJF8EIyBu8tCAbyUUXwRwBSBu8tCAbyVsQRA0QTAVQzDIVUBQVCBulTBwAcsBjh4g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbiEsoAgQEBzwDIUAPPFslYzIEBAc8AyRIWABwgbpUwWfRbMJRBM/QX4gAqAAAAAENvbGxlY3Rpb24gY2xvc2VkAVAw0x8BghCUapi2uvLggdM/ATHIAYIQr/kPV1jLH8s/yfhCAXBt2zx/GQE6bW0ibrOZWyBu8tCAbyIBkTLiECRwAwSAQlAj2zweAvgw0x8BghAev8OcuvLggYEBAdcAATFZ2zyDB1RBFFn0D2+hkjBt3yBukjBtjkPQ+kAh1wsBwwCOHQEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIkjFt4gHSAIEBAdcA1AHQAYEBAdcAVUBsFW8F4iBulDDyxE3jDgF/IBsBTiBu8tCAbyVfBCBu8tCAyIIQefk36gHLH3AByz/JcIBAfwQDbW3bPB4DrlBD2zz4QW8kE18D+CdvECGhghAF9eEAZrYIoYIJycOAoKElbrOOkAUgbvLQgBVyJH9ERG1t2zySMDTiAdDWXzHUMCD5AAHQ1h8x0z8wgwdtQAVw+CNDMCAeHQCsyFVAUFQgbpUwcAHLAY4eINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8W4hLKAIEBAc8AyFADzxbJWMyBAQHPAMkQNBAkIG6VMFn0WzCUQTP0F+IByshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZQA/oCcAHKaCNus5F/kyRus+KXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsAHwCYfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzAAS+EJSIMcF8uCEAcDtRNDUAfhj0gABjiX6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfQEWWwS4Pgo1wsKgwm68uCJ+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHR2zwiAAJt7A5GYQ==');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initTonDriveUserCollection_init_args({ $$type: 'TonDriveUserCollection_init_args', owner })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const TonDriveUserCollection_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
}

const TonDriveUserCollection_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"FileInfo","header":null,"fields":[{"name":"storageContractAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"closed","type":{"kind":"simple","type":"bool","optional":false}},{"name":"fileSize","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}},{"name":"created","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Create","header":1563101277,"fields":[{"name":"payload","type":{"kind":"simple","type":"cell","optional":false}},{"name":"storageProviderAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"name","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"CloseItem","header":515883932,"fields":[{"name":"torrentHash","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
]

const TonDriveUserCollection_getters: ABIGetter[] = [
    {"name":"allItems","arguments":[],"returnType":{"kind":"dict","key":"uint","keyFormat":256,"value":"FileInfo","valueFormat":"ref"}},
    {"name":"owner","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

const TonDriveUserCollection_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"Create"}},
    {"receiver":"internal","message":{"kind":"typed","type":"CloseItem"}},
    {"receiver":"internal","message":{"kind":"text","text":"create_collection"}},
    {"receiver":"internal","message":{"kind":"text","text":"withdraw_all"}},
    {"receiver":"internal","message":{"kind":"any"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class TonDriveUserCollection implements Contract {
    
    static async init(owner: Address) {
        return await TonDriveUserCollection_init(owner);
    }
    
    static async fromInit(owner: Address) {
        const init = await TonDriveUserCollection_init(owner);
        const address = contractAddress(0, init);
        return new TonDriveUserCollection(address, init);
    }
    
    static fromAddress(address: Address) {
        return new TonDriveUserCollection(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  TonDriveUserCollection_types,
        getters: TonDriveUserCollection_getters,
        receivers: TonDriveUserCollection_receivers,
        errors: TonDriveUserCollection_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Create | CloseItem | 'create_collection' | 'withdraw_all' | Slice | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Create') {
            body = beginCell().store(storeCreate(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CloseItem') {
            body = beginCell().store(storeCloseItem(message)).endCell();
        }
        if (message === 'create_collection') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === 'withdraw_all') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && message instanceof Slice) {
            body = message.asCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getAllItems(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('allItems', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.BigUint(256), dictValueParserFileInfo(), source.readCellOpt());
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}