import {useEffect, useState} from "react";
import type {TonStorageFile} from "../../../entities/file/model/TonStorageFile";
import {useMyCollection} from "../../drive/hook/useMyCollection";
import { useRealtimeRemoteState } from "../../../shared/hooks/useRealtimeRemoteState";
import { FileInfo } from "../../../services/FilesService";

export function useUserFiles(): TonStorageFile[] {
    const [files, setFiles] = useState<TonStorageFile[]>([]);
    const myCollection = useMyCollection()

    useEffect(() => {
        if (myCollection == null) {
            return
        }
        myCollection.fileList()
            .then(mapFiles)
            .then(setFiles)
    }, [myCollection])


    return files;
}

export function useRealtimeUserFiles() {
  const myCollection = useMyCollection()

  return useRealtimeRemoteState({
    fetchFn: async () => {
      if (myCollection == null) {
        return [];
      }
      const files = await myCollection.fileList()
      return mapFiles(files)
    },
    isEqualFn: (oldFiles, newFiles) => {
      if (oldFiles === null) {
        return newFiles !== null;
      }
      if (oldFiles.length !== newFiles.length) {
        return false;
      }
      for (let i = 0; i < oldFiles.length; i++) {
        const oldFile = oldFiles[i];
        const newFile = newFiles[i];
        if (oldFile.bagId !== newFile.bagId) {
          return false;
        }
      }
      return true;
    },
    deps: [myCollection]
  }) || [];
}

function mapFiles(files: FileInfo[]): TonStorageFile[] {
  return files.map(file => {
    const [name, extension] = splitFileName(file.name)
    return {
      bagId: `${BigInt(file.bagId).toString(16)}`,
      name: name,
      extension: extension,
      //TODO: replace with a proper code
      size: parseInt(`${file.fileSize}`),
      //TODO: rework once corresponding field is handled by the contract
      date: new Date('2021-08-03'),
      storageContractInfo: {
          address: file.storageContractAddress
      }
    }
  })
}

function splitFileName(fileName: string): [string, string] {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return [fileName, ''];
  }
  return [
    fileName.substring(0, lastDotIndex),
    fileName.substring(lastDotIndex + 1)
  ];
}
