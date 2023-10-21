import { type FormEvent } from "react"

export interface FileUploadProps {
  className?: string;
}

export default function FileUpload({ className = '' }: FileUploadProps) {

  async function handleFileUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file')
    console.log(file)

    const response = await fetch('http://127.0.0.1:3000/upload', {
      method: 'POST',
      body: formData
    });
    console.log(await response.json())
  }

  return (
    <>
      <form onSubmit={handleFileUpload} encType='multipart/form-data' className={`form-control gap-y-2 ${className}`}>
        <input type='file' name='file' className="file-input file-input-bordered file-input-accent w-full max-w-xs" />
        <button type='submit' className="btn btn-accent">
          Upload
        </button>
      </form>
    </>
  )
}
