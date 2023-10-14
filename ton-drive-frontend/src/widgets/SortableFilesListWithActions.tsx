import { useState, useEffect } from "react";

import FilesListWithActions from "../features/file/ui/FilesListWithActions";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import { useUserFiles } from "./hooks/useUserFile";

export default function SortableFilesListWithActions() {
  const files = useUserFiles()
  const [sortedFiles, setSortedFiles] = useState(files)
  useEffect(() => {
    setSortedFiles(files)
  }, [files])
  return (
    <>
      <FilesSortControls files={files} onSort={(sortedFiles) => setSortedFiles(sortedFiles)} />
      <FilesListWithActions files={sortedFiles} />
    </>
  )
}
