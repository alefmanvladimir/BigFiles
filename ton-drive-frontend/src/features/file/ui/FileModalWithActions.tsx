import { forwardRef, type ForwardedRef } from "react";
import FileModal from "../../../entities/file/ui/FileModal";
import type { TonStorageFile } from "../../../entities/file/model/TonStorageFile";
import { createDownloadLink } from "../../../entities/file/utils/createDownloadLink";

export interface FileModalWithActionsProps {
  file: TonStorageFile | null;
  className?: string;
}

export default forwardRef(function FileModalWithActions(
    { file, className = "" }: FileModalWithActionsProps,
    ref: ForwardedRef<HTMLDialogElement>
  ) {
  return (
    <FileModal
      ref={ref}
      file={file}
      className={className}
      actions={
        <>
          {
            file && <a className="btn" download href={createDownloadLink(file)} target="_blank">Download</a>
          }
        </>
      }
    />
  );
})
