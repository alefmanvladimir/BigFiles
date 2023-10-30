import type { TonStorageFile } from "../model/TonStorageFile";

export function createDownloadLink(file: TonStorageFile) {
  // TODO: replace link with personal
  return `https://storage.ton.run/gateway/${file.bagId}/${file.name}.${file.extension}`
}
