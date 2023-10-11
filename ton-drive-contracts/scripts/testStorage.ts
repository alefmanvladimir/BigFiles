import {Address, Cell, toNano} from "ton-core";
import {NetworkProvider} from "@ton-community/blueprint";
import {readFileSync, writeFileSync} from "fs";
import * as path from "path";

export async function run(provider: NetworkProvider) {
  //https://ndatg.github.io/tonstorage-dapp/#
  const addr = Address.parse("UQCYNSSutUKJRWI9VgZqpSkBz5E3tfSh60g0SBDxwSP5hakL")

  const sampleFileContent = `Test file with random content ${new Date()}`

  writeFileSync(path.join(__dirname, "..", "temp", "test-file.txt"), sampleFileContent)

  const formData = new FormData();
  console.log("Sample: ", sampleFileContent)

  formData.set('file',
    // //@ts-ignore
    new Blob([readFileSync(path.join(__dirname, "..", "temp", "test-file.txt")).buffer]),
    "test-file.txt"
  );

  const bagId = await fetch("http://159.223.4.194:3000/upload", {
    method: "POST",
    body: formData
  })
    .then(x => x.json())
    .then(x => x["bagId"])
    .catch(console.log)

  console.log(`Bag ID: ${bagId}`)

  const contractFile = await fetch(`http://159.223.4.194:3000/contracts?bagId=${bagId}&providerAddress=${addr.toRawString()}`, {
    method: "POST"
  })
    .then(res => res.arrayBuffer())

  await provider.sender().send({
    value: toNano("1"),
    to: addr,
    body: Cell.fromBoc(Buffer.from(contractFile))[0]
  })
}
