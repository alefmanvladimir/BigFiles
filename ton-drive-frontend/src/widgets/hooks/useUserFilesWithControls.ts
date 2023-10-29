import {useState, useEffect} from "react";
import {useUserFiles} from "../../features/file/hooks/useUserFiles";

import type { TonStorageFile } from "../../entities/file/model/TonStorageFile";

export function useUserFilesWithControls() {
  const files = useUserFiles()
  const [filteredFiles, setFilteredFiles] = useState(files)
  const [displayedFiles, setDisplayedFiles] = useState(files)

  useEffect(() => {
    setFilteredFiles(files)
    setDisplayedFiles(files)
  }, [files])

  function onFilter(foundFiles: TonStorageFile[]) {
    setFilteredFiles(foundFiles)
    setDisplayedFiles(foundFiles)
  }

  function onSort(sortedFiles: TonStorageFile[]) {
    setDisplayedFiles(sortedFiles)
  }

  return {
    dataToFilter: files,
    dataToSort: filteredFiles,
    files: displayedFiles,
    onFilter,
    onSort
  }
}
