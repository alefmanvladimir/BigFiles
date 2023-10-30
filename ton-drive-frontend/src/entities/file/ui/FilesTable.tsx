import FilesTableRow from "./FilesTableRow";
import type { TonStorageFile } from "../model/TonStorageFile"

export interface FilesListProps {
  files: TonStorageFile[]
  className?: string
  onChooseFile?: (file: TonStorageFile) => void
}

export default function FilesTable({ files, className, onChooseFile }: FilesListProps) {
  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <table className="table bg-base-100">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Date</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <FilesTableRow key={index} className="my-3" file={file} onClick={onChooseFile} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
