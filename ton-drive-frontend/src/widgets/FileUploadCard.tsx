import { useState } from "react";
import {type FormEvent} from "react"
import {useTonClient} from "../shared/hooks/useTonClient";
import {useTonConnect} from "../shared/hooks/useTonConnect";
import {useTonAddress} from "@tonconnect/ui-react";
import { uploadFile } from "../features/file/api/uploadFile";

export interface FileUploadProps {
    className?: string;
}

export default function FileUpload({className = ''}: FileUploadProps) {
  const [isFetching, setIsFetching] = useState(false)
  const tonClient = useTonClient()
  const sender = useTonConnect().sender
  const wallet = useTonAddress()

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
        <input type='file' name='file' disabled={isFetching}
          className="file-input file-input-bordered file-input-accent w-full max-w-xs"/>
        <div className="card-actions justify-end">
          <button type='submit' disabled={isFetching}
            className={`btn btn-accent btn-outline btn-sm ${isFetching ? 'btn-disabled' : ''}`}>
            {
              isFetching ? 'Uploading...' : 'Upload'
            }
          </button>
        </div>
      </form>
    </div>
  )
}
