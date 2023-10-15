import { useEffect, useState } from "react";
import type { TonStorageFile } from "../../entities/file/model/TonStorageFile";

export function useUserFiles(): TonStorageFile[] {
  const [files, setFiles] = useState<TonStorageFile[]>([]);
  useEffect(() => {
    fetchFiles().then(setFiles);
  }, []);
  return files;
}

async function fetchFiles(): Promise<TonStorageFile[]> {
  return [
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEB2E40666D25DA89291F4930", name: "file1", extension: "gif", size: 100, date: new Date('2021-08-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEB2E40666D25DA89291F4931", name: "file2", extension: "jpeg", size: 200, date: new Date('2022-08-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4932", name: "file3", extension: "pdf", size: 300, date: new Date('2023-08-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4942", name: "data", extension: "json", size: 300, date: new Date('2023-08-02') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4933", name: "file4", extension: "mp3", size: 400_000, date: new Date('2023-07-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4934", name: "file5", extension: "xls", size: 500_000, date: new Date('2023-06-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4935", name: "file6", extension: "ppt", size: 600_000, date: new Date('2023-05-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4945", name: "my-book", extension: "epub", size: 600_000, date: new Date('2023-05-02') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4936", name: "file7", extension: "zip", size: 700_000_000, date: new Date('2023-04-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4937", name: "file8", extension: "docx", size: 800_000_000, date: new Date('2023-03-03') },
    { bagId: "8A3BFBAC38A688322EC507C06F90D5FA74DEECEEEEB2E40666D25DA89291F4938", name: "file9", extension: "mp4", size: 900_000_000, date: new Date('2023-02-03') },
  ];
}
