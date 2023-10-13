import { useEffect, useState } from "react";
import type { TonStorageFile } from "../../../entities/file/model/TonStorageFile";

export function useUserFiles(): TonStorageFile[] {
  const [files, setFiles] = useState<TonStorageFile[]>([]);
  useEffect(() => {
    fetchFiles().then(setFiles);
  }, []);
  return files;
}

async function fetchFiles(): Promise<TonStorageFile[]> {
  return [
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEB2E40666D25DA89291F4930", name: "file1", extension: "txt", size: 100 },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEB2E40666D25DA89291F4931", name: "file2", extension: "txt", size: 200 },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEB2E40666D25DA89291F4932", name: "file3", extension: "txt", size: 300 },
  ];
}
