import type { TonStorageFile } from "../model/TonStorageFile"
import FileSize from "./FileSize"
import FileDate from "./FileDate"
import FileTypeIcon from "./FileTypeIcon"

export interface FilesListItemProps {
  file: TonStorageFile
  className?: string
  actions?: JSX.Element
}

export default function FilesListItem({ file, className, actions }: FilesListItemProps) {
  return (
    <li className={`card card-compact flex-row items-center gap-2 bg-base-300 p-3 ${className ?? ''}`}>
      <div>
        <FileTypeIcon extension={file.extension} />
      </div>
      <div className="text-ellipsis overflow-hidden">
        <div className="card-title">
          {file.name}.{file.extension}
          <div className="badge badge-neutral"><FileSize size={file.size} /></div>
        </div>
        <div className="text-neutral-content text-sm"><FileDate date={file.date} /></div>
        <span className="text-neutral-content text-sm">{file.bagId}</span>
      </div>
      {/* Actions */}
      <div className="ml-auto">
        {actions}
      </div>
    </li>
  )
}
