import FilesListItem from "./FilesListItem";
import type { TonStorageFile } from "../model/TonStorageFile"

export interface FilesListProps {
  files: TonStorageFile[]
  className?: string
}

export default function FilesList({ files, className }: FilesListProps) {
  return (
    <ul className={`${className ?? ''}`}>
      {files.map((file) => (
        <FilesListItem file={file} className="my-3" />
      ))}
    </ul>
  )


}
