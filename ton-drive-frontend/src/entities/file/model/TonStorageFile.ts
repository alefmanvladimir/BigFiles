import {Address} from "ton-core";

export type StorageContractInfo = {
  address: Address | null
}
export interface TonStorageFile {
  name: string;
  extension: string;
  /** File size in bytes */
  size: number;
  bagId: string;
  date: Date;
  storageContractInfo: StorageContractInfo
}
