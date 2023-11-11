import { useState, useMemo, useRef } from "react";
import { type FormEvent } from "react";
import { useTonClient } from "../shared/hooks/useTonClient";
import { useTonConnect } from "../shared/hooks/useTonConnect";
import { useTonAddress } from "@tonconnect/ui-react";
import { uploadFile } from "../features/file/api/uploadFile";
import FileTypeIcon from "../entities/file/ui/FileTypeIcon";
import { splitFileName } from "../entities/file/utils/splitFileName";
import { createFileContract } from "../features/file/api/createFileContract";

export interface FileUploadProps {
  className?: string;
}

export default function FileUpload({ className = "" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const isFetching = isUploading || isCreatingContract;
  const tonClient = useTonClient();
  const sender = useTonConnect().sender;
  const wallet = useTonAddress();

  const [fileString, setFileString] = useState<string | null>(null);
  const [fileName, fileExtension] = useMemo(() => splitFileName(fileString ?? ""), [fileString]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleReset(e?: FormEvent<HTMLFormElement>) {
    if (fileInputRef.current == null) {
      return;
    }
    fileInputRef.current.value = "";
    handleFileChange();
  }

  function handleFileChange(e?: FormEvent<HTMLInputElement>) {
    if (!e) {
      setFileString(null);
      return;
    }
    const file = e.currentTarget.files?.item(0);
    if (file == null) {
      setFileString(null);
      return;
    }
    setFileString(file.name);
  }

  async function handleFileUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");

    if (file == null) {
      throw new Error("File not chosen");
    }

    if (!(file instanceof File)) {
      throw new Error(`File is not instance of File: ${file}`);
    }

    if (file.size === 0) {
      throw new Error("File is empty");
    }

    setIsUploading(true);
    const bagId = await uploadFile(file);
    setIsUploading(false);
    setIsCreatingContract(true);
    await createFileContract({ tonClient, bagId, sender, wallet, file });
    setIsCreatingContract(false);
    handleReset();
  }

  return (
    <div className="overflow-x-auto">
      <div className={`card card-compact sm:card-normal bg-base-200 ${className}`}>
        <form onSubmit={handleFileUpload} onReset={handleReset} encType="multipart/form-data" className="card-body gap-y-2" aria-disabled={isFetching}>
          <h2 className="card-title">Upload File</h2>
          <label htmlFor="file-input" onDragOver={() => setIsDragOver(true)} onDragLeave={() => setIsDragOver(false)} onDrop={() => setIsDragOver(false)} onDragEnd={() => setIsDragOver(false)} onDragExit={() => setIsDragOver(false)} className={`relative block w-full h-32 rounded-lg ${isDragOver || fileString ? "outline-dashed outline-accent" : "outline-dotted"}`}>
            <div className="flex flex-col h-full items-center justify-center">
              <FileTypeIcon extension={fileExtension} className={`w-16 h-16 ${isDragOver || fileString ? "stroke-accent" : ""}`} />
              {isDragOver ? <h3 className={`text-xl font-bold text-accent`}>Drop me!</h3> : fileString ? <h3 className={`text-xl font-bold text-accent`}>File chosen: {fileString}</h3> : <h3 className={`text-xl font-bold`}>Choose a file...</h3>}
            </div>
            <input ref={fileInputRef} id="file-input" type="file" name="file" required disabled={isFetching} onChange={handleFileChange} className="opacity-0 absolute inset-0 block cursor-pointer" />
          </label>
          <div className="card-actions justify-end">
            <button type="reset" disabled={isFetching || !fileString} className={`btn btn-error btn-outline btn-sm ${isFetching || !fileString ? "btn-disabled" : ""}`}>
              Cancel
            </button>
            <button type="submit" disabled={isFetching || !fileString} className={`btn btn-accent btn-outline btn-sm ${isFetching || !fileString ? "btn-disabled" : ""}`}>
              {isUploading ? "Uploading..." : isCreatingContract ? "Creating contract..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
