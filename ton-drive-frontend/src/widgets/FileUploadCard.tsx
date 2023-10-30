import { useState, useMemo } from "react";
import {type FormEvent} from "react"
import {useTonClient} from "../shared/hooks/useTonClient";
import {useTonConnect} from "../shared/hooks/useTonConnect";
import {useTonAddress} from "@tonconnect/ui-react";
import { uploadFile } from "../features/file/api/uploadFile";
import FileTypeIcon from "../entities/file/ui/FileTypeIcon";
import { splitFileName } from "../entities/file/utils/splitFileName";

export interface FileUploadProps {
    className?: string;
}

export default function FileUpload({className = ''}: FileUploadProps) {
  const [isFetching, setIsFetching] = useState(false)
  const tonClient = useTonClient()
  const sender = useTonConnect().sender
  const wallet = useTonAddress()

  const [fileString, setFileString] = useState<string | null>(null)
  const [fileName, fileExtension] = useMemo(() => splitFileName(fileString ?? ''), [fileString])
  const [isDragOver, setIsDragOver] = useState(false)

  function handleFileChange(e: FormEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.item(0)
    if (file == null) {
      setFileString(null)
      return
    }
    setFileString(file.name)
  }

  async function handleFileUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file')

    if (file == null) {
        console.error("File not chosen")
        return;
    }

    if (!(file instanceof File)) {
      console.error('File is not instance of File', file)
      return
    }

    if (file.size === 0) {
      console.error('File is empty')
      return
    }

    setIsFetching(true)
    await uploadFile({ tonClient, sender, wallet, file })
    setIsFetching(false)
  }

  return (
    <div className={`card card-compact sm:card-normal bg-base-200 ${className}`}>
      <form
        onSubmit={handleFileUpload}
        encType='multipart/form-data'
        className="card-body gap-y-2"
        aria-disabled={isFetching}>
        <h2 className="card-title">Upload File</h2>
        <label htmlFor="file-input"
          onDragOver={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={() => setIsDragOver(false)}
          onDragEnd={() => setIsDragOver(false)}
          onDragExit={() => setIsDragOver(false)}
          className={`relative block w-full h-32 rounded-lg ${isDragOver || fileString ? 'outline-dashed outline-accent' : 'outline-dotted'}`}>
          <div className="flex flex-col h-full items-center justify-center">
            <FileTypeIcon extension={fileExtension} className={`w-16 h-16 ${isDragOver || fileString ? 'stroke-accent' : ''}`}/>
            {
              isDragOver ?
                <h3 className={`text-xl font-bold text-accent`}>Drop me!</h3> :
              fileString ?
                <h3 className={`text-xl font-bold text-accent`}>File chosen: {fileString}</h3> :
              <h3 className={`text-xl font-bold`}>Choose a file...</h3>
            }
          </div>
          <input id="file-input" type='file' name='file' required disabled={isFetching}
            onChange={handleFileChange}
            className="opacity-0 absolute inset-0 block cursor-pointer"/>
        </label>
        <div className="card-actions justify-end">
          <button type='submit' disabled={isFetching || !fileString}
            className={`btn btn-accent btn-outline btn-sm ${isFetching || !fileString ? 'btn-disabled' : ''}`}>
            {
              isFetching ? 'Uploading...' : 'Upload'
            }
          </button>
        </div>
      </form>
    </div>
  )
}
