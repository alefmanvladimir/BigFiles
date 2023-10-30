import { forwardRef, type ForwardedRef } from "react";
import type { TonStorageFile } from "../model/TonStorageFile";
import FileSize from "./FileSize";
import FileDate from "./FileDate";
import FileTypeIcon from "./FileTypeIcon";
import ContractLink from "../../../shared/ui/ContractLink";

export interface FileModalProps {
  file: TonStorageFile | null;
  className?: string;
  onClose?: () => void;
  actions?: JSX.Element;
}

export default forwardRef(function FileModal(
    {file, onClose, actions, className = ""}: FileModalProps,
    ref: ForwardedRef<HTMLDialogElement>
  ) {
  function handleClose(e: React.FormEvent<HTMLFormElement>) {
    if (onClose) {
      onClose();
    }
  }
  return (
    <dialog ref={ref} className={`modal modal-bottom sm:modal-middle ${className}`}>
      {
        file ?
          <div className="modal-box">
            <form onSubmit={handleClose} method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <header className="flex flex-wrap items-center gap-2 mb-3">
              <div>
                <FileTypeIcon extension={file.extension} />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {file.name}
                  <div className="badge badge-neutral ml-1">{file.extension}</div>
                </h3>
                <p>
                  <FileSize size={file.size} /> | <FileDate date={file.date} />
                </p>
              </div>
            </header>
            <section className="overflow-x-auto my-3">
              <table className="table table-pin-cols">
                <tbody>
                  <tr>
                    <th>Bag ID</th>
                    <td>{file.bagId}</td>
                  </tr>
                  <tr>
                    <th>Contract</th>
                    <td>{
                          file.storageContractInfo.address ?
                            <ContractLink address={file.storageContractInfo.address?.toString()} /> :
                            <span className={"text-error-content text-sm"}>Not ready</span>
                        }
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="modal-action">
              {actions}
            </section>
          </div> :
          <div className="modal-box">
            <p className="text-error">Error: file is not chosen</p>
          </div>
      }
    </dialog>
  )
})
