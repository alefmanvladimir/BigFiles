import { useCallback } from 'react'

import ExpandedFilesListItem from "./ExpandedFilesListItem";
import type { TonStorageFile } from "../model/TonStorageFile"

export interface FilesListProps {
  files: TonStorageFile[]
  className?: string
  createActions?: (file: TonStorageFile) => JSX.Element
}

export default function ExpandedFilesList({ files, className, createActions }: FilesListProps) {
  const memoizedCreateActions = useCallback(createActions ?? defaultCreateActions, [createActions, files])
  return (
    <ul className={`${className ?? ''}`}>
      {files.map((file, index) => (
        <ExpandedFilesListItem key={index} className="my-3" file={file} actions={memoizedCreateActions(file)} />
      ))}
    </ul>
  )
}

function defaultCreateActions(file: TonStorageFile) {
  return (<></>)
}
