import {Address, beginCell, Cell, openContract, Slice, toNano, TupleItem} from "ton-core";
import {compile, NetworkProvider} from "@ton-community/blueprint";
import {createReadStream, readFileSync, writeFileSync} from "fs";
import * as path from "path";
import {StorageProvider} from "../wrappers/StorageProvider";
import {TupleItemSlice} from "ton-core/src/tuple/tuple";

export async function run(provider: NetworkProvider) {
  //https://ndatg.github.io/tonstorage-dapp/#
  const addr = Address.parse(`${process.env.TON_STORAGE_PROVIDER_ADDRESS}`)

  // const sampleFileContent = `Test!!!!!!!
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  // sdasdasdasdasdas dasdasd asd asdasdsd
  // file with random content ${new Date()}`
  //
  // writeFileSync(path.join(__dirname, "..", "temp", "test-file.txt"), sampleFileContent)
  // const file = readFileSync(path.join(__dirname, "..", "temp", "test-file.txt"))
  //
  // const formData = new FormData();
  // console.log("Sample: ", sampleFileContent)
  // formData.set('file',
  //   new Blob([file]),
  //   "test-file-3.txt"
  // );
  //
  // const bagId = await fetch(`${process.env.TON_STORAGE_BACKEND_HOST}/upload`, {
  //   method: "POST",
  //   body: formData
  // })
  //   .then(x => x.json())
  //   .then(x => x["bagId"])
  //   .catch(console.log)
  //
  // console.log(`Bag ID: ${bagId}`)
  //
  const contractFile = await fetch(`${process.env.TON_STORAGE_BACKEND_HOST}/contracts?bagId=${bagId}&providerAddress=${addr.toRawString()}`, {
    method: "POST"
  })
    .then(res => res.arrayBuffer())
  //
  // const msgBody = Cell
  //   .fromBoc(Buffer.from(contractFile))[0]
  // const inMsgBody = msgBody
  //   .beginParse()
  // const op = inMsgBody.loadUint(32)
  // const queryId = inMsgBody.loadUint(64)
  // const torrentInfo = inMsgBody.loadRef()
  // const infoCs = torrentInfo.beginParse()
  // infoCs.skip(32)
  // const fileSize = infoCs.loadUint(64)
  // const merkleHash = BigInt(inMsgBody.loadUint(256))
  // const expectedRate = inMsgBody.loadCoins()
  // const expectedMaxSpan = inMsgBody.loadUint(32);
  //
  // const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`)//.toString('hex')
  // console.log(`op: ${op},\n size: ${fileSize},\n queryId: ${queryId},\n merkle: ${merkleHash},\n expectedRate: ${expectedRate},\n expectedMaxSpan: ${expectedMaxSpan},\n torrentHash: ${torrentHash}`)
  //
  // await provider.sender().send({
  //   value: toNano("1.0"),
  //   to: addr,
  //   body: Cell.fromBoc(Buffer.from(contractFile))[0]
  // })
  //
  const storageProviderContract = provider.provider(addr)
  const storageProviderContractState = await storageProviderContract.getState()
  console.log(`Provider Balance: ${storageProviderContractState.balance}`)

  // const merkleHash = BigInt("64558989785713264499902445831571115264603494528857508510165592662552036245504")
  const merkleHash = BigInt("64558989785713261782043389794268576297682300078346429077123872462260003471064")
  const fileSize = 1422
  const torrentHash = BigInt("103551164157402959177510556466285663213184273410775102169699014481738699353157")
  console.log(`
    merkle: ${merkleHash},
    fileSize: ${fileSize},
    torrentHash: ${torrentHash}
  `)
  const params: TupleItem[] = [{
    type: 'int',
    value: merkleHash
  }, {
    type: 'int',
    value: BigInt(fileSize)
  }, {
    type: 'slice',
    cell: beginCell().storeAddress(provider.sender().address).endCell()
  }, {
    type: 'int',
    value: torrentHash
  }]
  console.log(`Provider address: ${provider.sender().address}`)
  const storageContractAddress = await storageProviderContract.get(
    'get_storage_contract_address',
    params
  )
  // const storageContractAddress2 = await storageProviderContract.get(
  //   'get_storage_contract_address',
  //   params2
  // )

  //@ts-ignore
  // storageContractAddress.stack.readAddressOpt()
  // const res1: TupleItemSlice = storageContractAddress.stack.pop() as TupleItemSlice
  //@ts-ignore
  const rr = storageContractAddress.stack.readAddressOpt()
  console.log(rr)
  //console.log(`Storage Contract: ${}`)
  // console.log(`Storage Contract2: ${storageContractAddress2.stack.readAddress().toRawString()}`)
}
