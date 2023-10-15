import {Address, Cell, toNano} from "ton-core";
import {NetworkProvider} from "@ton-community/blueprint";
import {readFileSync, writeFileSync} from "fs";
import * as path from "path";

export async function run(provider: NetworkProvider) {
  //https://ndatg.github.io/tonstorage-dapp/#
  const addr = Address.parse(`${process.env.TON_STORAGE_PROVIDER_ADDRESS}`)

  const sampleFileContent = `Test file with random content ${new Date()}`

  writeFileSync(path.join(__dirname, "..", "temp", "test-file.txt"), sampleFileContent)

  const formData = new FormData();
  console.log("Sample: ", sampleFileContent)

  formData.set('file',
    // //@ts-ignore
    new Blob([readFileSync(path.join(__dirname, "..", "temp", "test-file.txt")).buffer]),
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

  await provider.sender().send({
    value: toNano("1"),
    to: addr,
    body: Cell.fromBoc(Buffer.from(contractFile))[0]
  })
}
