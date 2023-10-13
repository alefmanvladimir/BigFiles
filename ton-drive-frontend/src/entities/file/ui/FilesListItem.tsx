import type { TonStorageFile } from "../model/TonStorageFile"
import FileSize from "./FileSize"

export interface FilesListItemProps {
  file: TonStorageFile
  className?: string
}

export default function FilesListItem({ file, className }: FilesListItemProps) {
  return (
    <li className={`card card-compact flex-row items-center gap-2 bg-base-300 p-3 ${className ?? ''}`}>
      {/* Document icon */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
      <div className="text-ellipsis overflow-hidden">
        <div className="card-title">
          {file.name}.{file.extension}
          <div className="badge badge-neutral"><FileSize size={file.size} /></div>
        </div>
        <span className="text-neutral-content text-sm">{file.bagId}</span>
      </div>
    </li>
  )
}
