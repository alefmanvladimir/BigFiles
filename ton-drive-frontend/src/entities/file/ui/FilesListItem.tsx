import type {TonStorageFile} from "../model/TonStorageFile"
import FileSize from "./FileSize"
import FileDate from "./FileDate"
import FileTypeIcon from "./FileTypeIcon"

export interface FilesListItemProps {
    file: TonStorageFile
    className?: string
    actions?: JSX.Element
}

export default function FilesListItem({file, className, actions}: FilesListItemProps) {
    return (
        <li className={`card card-compact flex-row items-center gap-2 bg-base-300 p-3 ${className ?? ''}`}>
            <div>
                <FileTypeIcon extension={file.extension}/>
            </div>
            <div className="text-ellipsis overflow-hidden">
                <div className="card-title">
                    {file.name}
                    <div className="badge badge-neutral">{file.extension}</div>
                </div>
                <div className="text-accent-content text-sm"><FileSize size={file.size}/> | <FileDate date={file.date}/>
                </div>
                <span className="text-accent-content text-sm">{file.bagId}</span>
                <div>
                    <span className="text-accent-content text-sm">
                        Storage Contract: {
                        file.storageContractInfo.address ? file.storageContractInfo.address?.toString() : <span className={'text-error-content text-sm'}>Not ready</span>
                    }
                    </span>
                </div>
            </div>
            {/* Actions */}
            <div className="ml-auto">
                {actions}
            </div>
        </li>
    )
}
