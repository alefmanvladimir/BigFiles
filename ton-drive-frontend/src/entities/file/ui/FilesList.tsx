import { useCallback } from 'react'

import FilesListItem from "./FilesListItem";
import type { TonStorageFile } from "../model/TonStorageFile"

export interface FilesListProps {
  files: TonStorageFile[]
  className?: string
  createActions?: (file: TonStorageFile) => JSX.Element
}

export default function FilesList({ files, className, createActions }: FilesListProps) {
  const memoizedCreateActions = useCallback(createActions ?? defaultCreateActions, [createActions, files])
  return (
    <ul className={`${className ?? ''}`}>
      {files.map((file) => (
        <FilesListItem className="my-3" file={file} actions={memoizedCreateActions(file)} />
      ))}
    </ul>
  )
}

function defaultCreateActions(file: TonStorageFile) {
  return (<></>)
}
