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

 type TonDriveMaster_init_args = {
    $$type: 'TonDriveMaster_init_args';
}

function initTonDriveMaster_init_args(src: TonDriveMaster_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
    };
}

async function TonDriveMaster_init() {
    const __code = Cell.fromBase64('te6ccgECFQEAA7QAART/APSkE/S88sgLAQIBYgIDApLQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxZ2zzy4IIwyPhDAcx/AcoAye1UDgQCAVgKCwLw7aLt+wGSMH/gcCHXScIflTAg1wsf3iCCEJRqmLa6jqgw0x8BghCUapi2uvLggdM/ATHIAYIQr/kPV1jLH8s/yfhCAXBt2zx/4MAAjqf5AYLwSqgZAXSCt4d18bRWm4A9clSTYTUtklBPSb3VZl9VzeK64wKRMOJwBQYBOm1tIm6zmVsgbvLQgG8iAZEy4hAkcAMEgEJQI9s8CAO0+ELbPFxwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiHCAQogQNUQwEn8GBQRBM9s8f9sxEQcIACoAAAAAY3JlYXRlX2NvbGxlY3Rpb24ByshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZQA/oCcAHKaCNus5F/kyRus+KXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsACQCYfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzAIBWAwNAgFIExQCSbAdyDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjbPAHbPDGAODwCVsvRgnBc7D1dLK57HoTsOdZKhRtmgnCd1jUtK2R8syLTry398WI5gnAgVcAbgGdjlM5YOq5HJbLDgnCdl05as07LczoOlm2UZuikgATTtRNDUAfhj0gAwkW3g+CjXCwqDCbry4InbPBABjlIQ2zxsEnBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIEQACbQEK+EMB2zwSAJgB0PQEMG0BggDEiQGAEPQPb6Hy4IcBggDEiSICgBD0F8gByPQAyQHMcAHKAFgg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJABGwr7tRNDSAAGAAdbJu40NWlwZnM6Ly9RbVVXRHdIYUprVjVRbUtpdjRWVlZZRXlqZEttaDJIcEdiWjFEWExRNkp4YkN3gg');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initTonDriveMaster_init_args({ $$type: 'TonDriveMaster_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const TonDriveMaster_errors: { [key: number]: { message: string } } = {
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

const TonDriveMaster_types: ABIType[] = [
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

const TonDriveMaster_getters: ABIGetter[] = [
    {"name":"user_collection_address","arguments":[{"name":"userAddr","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
]

const TonDriveMaster_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"text","text":"create_collection"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class TonDriveMaster implements Contract {
    
    static async init() {
        return await TonDriveMaster_init();
    }
    
    static async fromInit() {
        const init = await TonDriveMaster_init();
        const address = contractAddress(0, init);
        return new TonDriveMaster(address, init);
    }
    
    static fromAddress(address: Address) {
        return new TonDriveMaster(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  TonDriveMaster_types,
        getters: TonDriveMaster_getters,
        receivers: TonDriveMaster_receivers,
        errors: TonDriveMaster_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: 'create_collection' | Deploy) {
        
        let body: Cell | null = null;
        if (message === 'create_collection') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getUserCollectionAddress(provider: ContractProvider, userAddr: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(userAddr);
        let source = (await provider.get('user_collection_address', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}