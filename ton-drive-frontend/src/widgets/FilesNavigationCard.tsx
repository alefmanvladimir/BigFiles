import { useState, useRef, useEffect } from "react";
import FilesTable from "../entities/file/ui/FilesTable";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import FilesSearchBox from "../features/file/ui/FilesSearchBox";
import FileModalWithActions from "../features/file/ui/FileModalWithActions";
import { useUserFilesWithControls } from "./hooks/useUserFilesWithControls";
import type { TonStorageFile } from "../entities/file/model/TonStorageFile";

export interface FilesNavigationProps {
  className?: string
}

export default function FilesNavigationCard({className = ""}: FilesNavigationProps) {
  const {
    files,
    dataToFilter, dataToSort,
    onFilter, onSort
  } = useUserFilesWithControls()

  const [selectedFileBagId, setSelectedFileBagId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<TonStorageFile | null>(null)
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (selectedFileBagId) {
      const file = files.find(file => file.bagId === selectedFileBagId)
      if (file) {
        setSelectedFile(file)
      }
    }
  }, [selectedFileBagId, files])

  function chooseFile(file: TonStorageFile) {
    setSelectedFileBagId(file.bagId)
    if (modalRef.current) {
      modalRef.current.showModal()
    }
  }

  return (
    <>
      <div className={`card card-compact sm:card-normal bg-base-200 ${className}`}>
        <div className="card-body">
          <h2 className="card-title">Files</h2>
          <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
            <FilesSearchBox files={dataToFilter} onSearch={onFilter}/>
            <FilesSortControls files={dataToSort} onSort={onSort}/>
          </div>
          <FilesTable className="table-sm sm:table-md" files={files} onChooseFile={chooseFile}/>
        </div>
      </div>
      {
        <FileModalWithActions ref={modalRef} file={selectedFile}/>
      }
    </>
  )
}
