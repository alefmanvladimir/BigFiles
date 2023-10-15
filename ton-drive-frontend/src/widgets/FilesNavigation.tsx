import { useState, useEffect } from "react";

import FilesListWithActions from "../features/file/ui/FilesListWithActions";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import FilesSearchBox from "../features/file/ui/FilesSearchBox";
import { useUserFiles } from "./hooks/useUserFile";

export default function FilesNavigation() {
  const files = useUserFiles()
  const [sortedFiles, setSortedFiles] = useState(files)
  useEffect(() => {
    setSortedFiles(files)
  }, [files])
  return (
    <>
      <FilesSearchBox className="my-2" />
      <FilesSortControls className="my-2" files={files} onSort={(sortedFiles) => setSortedFiles(sortedFiles)} />
      <FilesListWithActions files={sortedFiles} />
    </>
  )
}
