import FilesList, {type FilesListProps} from "../../../entities/file/ui/FilesList";
import {useMyCollection} from "../../drive/hook/useMyCollection";
import {TonStorageFile} from "../../../entities/file/model/TonStorageFile";

export interface FilesListWithActionsProps {
    className?: string
    files: FilesListProps['files']
}

const createActions = (close: (hexBagId: string) => Promise<void>) => (file: TonStorageFile) => {
    return (
        <div className="join sm:join-vertical">
            <button className="join-item btn btn-outline btn-sm btn-primary" onClick={() => close(file.bagId)}>Close</button>
            <a
              download href={createDownloadLink(file)} target="_blank"
              className="join-item btn btn-outline btn-sm btn-accent">
                {/* Download icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                </svg>
            </a>
        </div>
    )
}

export default function FilesListWithActions(
    {className, files}: FilesListWithActionsProps) {
    const myCollection = useMyCollection()
    const closeItem = (bagId: string) => {
        return myCollection!!.closeContract(BigInt(`0x${bagId}`))
    }
    return (
        <>
            <FilesList className={className} files={files} createActions={createActions(closeItem)}/>
        </>
    )
}

function createDownloadLink(file: TonStorageFile) {
  return 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
  return `https://storage.ton.run/gateway/${file.bagId}/${file.name}.${file.extension}`
}
