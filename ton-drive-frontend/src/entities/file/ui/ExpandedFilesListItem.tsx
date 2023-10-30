import type { TonStorageFile } from "../model/TonStorageFile";
import FileSize from "./FileSize";
import FileDate from "./FileDate";
import FileTypeIcon from "./FileTypeIcon";
import ContractLink from "../../../shared/ui/ContractLink";

export interface FilesListItemProps {
  file: TonStorageFile;
  className?: string;
  actions?: JSX.Element;
}

export default function ExpandedFilesListItem({ file, className, actions }: FilesListItemProps) {
  return (
    <li className={`card card-compact bg-base-300 p-3 ${className ?? ""}`}>
      <div className="font-bold text-md">
        {file.name}
        <div className="badge badge-neutral ml-1">{file.extension}</div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 ">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-ellipsis overflow-hidden">
          <div className="flex items-center gap-2 sm:w-1/4">
            <div>
              <FileTypeIcon extension={file.extension} />
            </div>
            <div className="sm:flex sm:flex-col">
              <div className="text-accent-content text-xs">
                <FileSize size={file.size} /> | <FileDate date={file.date} />
              </div>
            </div>
          </div>
          <table className="table table-xs">
            <tbody>
              <tr>
                <th>Bag ID</th>
                <td>{file.bagId}</td>
              </tr>
              <tr>
                <th>Contract</th>
                <td>{file.storageContractInfo.address ? <ContractLink address={file.storageContractInfo.address?.toString()} /> : <span className={"text-error-content text-sm"}>Not ready</span>}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Actions */}
        <div className="ml-auto">{actions}</div>
      </div>
    </li>
  );
}
