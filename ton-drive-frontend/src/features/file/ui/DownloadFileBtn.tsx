import { useState, useEffect } from "react";
import type { TonStorageFile } from "../../../entities/file/model/TonStorageFile";

export interface DownloadFileBtnProps {
  file: TonStorageFile;
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export default function DownloadFileBtn({ file, className = "", children }: DownloadFileBtnProps) {
  const { bagId } = file
  const [status, setStatus] = useState({
    ready: false,
    downloadRequested: false,
    fileName: null
  })

  function prepareLink() {
    setStatus({ready: false, downloadRequested: true, fileName: null})
    const interval = setInterval(() => {
      fetch(`https://api.bigfiles.cloud/prepareDownload?bagId=${bagId}`, {method: 'POST'})
        .then(res => res.json())
        .then(res => {
          console.log(res)
          if (res.ready) {
            setStatus({
              ready: true,
              downloadRequested: false,
              fileName: res.fileName
            });
            clearInterval(interval);
          }
        })
        .catch(() => {
          setStatus({
            downloadRequested: false,
            fileName: null,
            ready: false
          })
          clearInterval(interval)
        })
    }, 2000)
    return interval
  }

  useEffect(() => {
    const interval = prepareLink()
    return () => clearInterval(interval)
  }, [file])

  if (status.ready) {
    return (
      <a
        download href={`https://bigfiles.cloud/api/download/${bagId}/${status.fileName}`} target="_blank"
        className={`btn btn-outline btn-success ${className}`}>
        <DownloadIcon />
      </a>
    )
  }

  if (status.downloadRequested) {
    return (
      <div className={`btn btn-outline btn-disabled ${className}`}>
        <span className="loading loading-bars loading-sm" />
      </div>
    )
  }

  return (
    <button
      onClick={prepareLink}
      className={`btn btn-outline btn-success ${className}`}>
      <DownloadIcon />
    </button>
  )
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
          stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
    </svg>
  )
}
