import { useState, useEffect } from "react";

import FilesListWithActions from "../features/file/ui/FilesListWithActions";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import FilesSearchBox from "../features/file/ui/FilesSearchBox";
import { useUserFiles } from "./hooks/useUserFile";

export default function FilesNavigation() {
  const files = useUserFiles()
  const [filteredFiles, setFilteredFiles] = useState(files)
  const [displayedFiles, setDisplayedFiles] = useState(files)
  useEffect(() => {
    setFilteredFiles(files)
    setDisplayedFiles(files)
  }, [files])
  return (
    <>
      <FilesSearchBox className="my-2" files={files} onSearch={(foundFiles) => {
          setFilteredFiles(foundFiles)
          setDisplayedFiles(foundFiles)
        }} />
      <FilesSortControls className="my-2" files={filteredFiles} onSort={(sortedFiles) => setDisplayedFiles(sortedFiles)} />
      <FilesListWithActions files={displayedFiles} />
    </>
  )
}
