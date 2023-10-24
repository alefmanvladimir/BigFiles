import {Address, beginCell, Cell, openContract, Slice, toNano, TupleItem} from "ton-core";
import {compile, NetworkProvider} from "@ton-community/blueprint";
import {createReadStream, readFileSync, writeFileSync} from "fs";
import * as path from "path";
import {TonDriveMaster} from "../build/TonDriveMaster/tact_TonDriveMaster";
import {TonDriveUserCollection} from "../build/TonDriveMaster/tact_TonDriveUserCollection";

export async function run(provider: NetworkProvider) {
  //https://ndatg.github.io/tonstorage-dapp/#
  const addr = Address.parse(`${process.env.TON_STORAGE_PROVIDER_ADDRESS}`)
  // const addr = Address.parse(`EQB-CYaRbbv0BrSTFzC-yI4yf5cU32i0plxYXguWJU3geojK`)

  const sampleFileContent = `Test!!!!!!!
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsdsdasdasdasdasdas dasdasd asd asdasdsd
  sdasdasdasdasdas dasdasd asd asdasdsd
  file with random content ${new Date()}`

  writeFileSync(path.join(__dirname, "..", "temp", "test-file.txt"), sampleFileContent)
  const file = readFileSync(path.join(__dirname, "..", "temp", "test-file.txt"))

  const formData = new FormData();
  console.log("Sample: ", sampleFileContent)
  formData.set('file',
    new Blob([file]),
    "test-file.txt"
  );

  const bagId = await fetch(`${process.env.TON_STORAGE_BACKEND_HOST}/upload`, {
    method: "POST",
    body: formData
  })
    .then(x => x.json())
    .then(x => x["bagId"])
    .catch(console.log)

  console.log(`Bag ID: ${bagId}`)

  const contractFile = await fetch(`${process.env.TON_STORAGE_BACKEND_HOST}/contracts?bagId=${bagId}&providerAddress=${addr.toRawString()}`, {
    method: "POST"
  })
    .then(res => res.arrayBuffer())

  const msgBody = Cell
    .fromBoc(Buffer.from(contractFile))[0]
  const inMsgBody = msgBody
    .beginParse()
  const op = inMsgBody.loadUint(32)
  const queryId = inMsgBody.loadUint(64)
  const torrentInfo = inMsgBody.loadRef()
  const infoCs = torrentInfo.beginParse()
  infoCs.skip(32)
  const fileSize = infoCs.loadUint(64)
  const merkleHash = BigInt(inMsgBody.loadUint(256))
  const expectedRate = inMsgBody.loadCoins()
  const expectedMaxSpan = inMsgBody.loadUint(32);

  const torrentHash = BigInt(`0x${torrentInfo.hash().toString('hex')}`)//.toString('hex')
  console.log(`op: ${op},\n size: ${fileSize},\n queryId: ${queryId},\n merkle: ${merkleHash},\n expectedRate: ${expectedRate},\n expectedMaxSpan: ${expectedMaxSpan},\n torrentHash: ${torrentHash}`)

  const tonDriveMasterContract = provider.open(TonDriveMaster.fromAddress(
      Address.parse('EQB-CYaRbbv0BrSTFzC-yI4yf5cU32i0plxYXguWJU3geojK')
  ))
  const collectionAddress = await tonDriveMasterContract.getUserCollectionAddress(
      provider.sender().address!!
  )
  console.log("Collection address: ", collectionAddress)

  const myCollection = provider.open(
      await TonDriveUserCollection.fromInit(provider.sender().address!!)
  )
  console.log("Collection address from init: ", myCollection.address)

  // await myCollection.send(
  //     provider.sender(),
  //     {
  //       value: toNano("0.5")
  //     },
  //     {
  //       $$type: 'Deploy',
  //       queryId: 1n
  //     }
  // )
  // await myCollection.send(
  //     provider.sender(),
  //     {
  //       value: toNano("0.6")
  //     },
  //     {
  //       $$type: 'Create',
  //       payload: Cell.fromBoc(Buffer.from(contractFile))[0],
  //       name: 'test.txt',
  //       fileSize: 1024n,
  //       storageProviderAddress: addr
  //     }
  // )
  // await myCollection.send(
  //     provider.sender(),
  //     {
  //       value: toNano("0.1")
  //     },
  //     {
  //       $$type: 'CloseItem',
  //       torrentHash: 108610355404627151718859536482233663313624141454072335433800252218076662464912n
  //     }
  // )
  // await myCollection.send(
  //     provider.sender(),
  //     {
  //       value: toNano("0.1")
  //     },
  //     'withdraw_all'
  // )

  // const items = await myCollection.getAllItems()
  // console.log(`Collection size: ${items.size}`)
  // items.keys().forEach(id => console.log(`${id} -> s=${items.get(id)?.fileSize}, name=${items.get(id)?.name}`))
  // await provider.sender().send({
  //   value: toNano("0.6"),
  //   to: addr,
  //   body: Cell.fromBoc(Buffer.from(contractFile))[0]
  // })
}
