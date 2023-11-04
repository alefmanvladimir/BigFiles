import { useState, useEffect } from "react";
import type { TonStorageFile } from "../../../entities/file/model/TonStorageFile";
import { prepareDownload } from "../api/prepareDownload";
import { getDownloadLink } from "../api/getDownloadLink";

export interface DownloadFileBtnProps {
  file: TonStorageFile;
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export default function DownloadFileBtn({ file, className = "", children }: DownloadFileBtnProps) {
  const { bagId } = file
  // By default, we assume that the file is not ready to download
  const [isReady, setIsReady] = useState(false)
  // By default, we assume that the file exists
  const [isExists, setIsExists] = useState(true)
  const [isDownloadRequested, setIsDownloadRequested] = useState(false)
  const [fileDownloadName, setFileDownloadName] = useState<string | null>(null)
  function prepareLink() {
    setIsDownloadRequested(true)
    const interval = setInterval(async () => {
      try {
        const response = await prepareDownload(bagId)
        if (response.ready) {
          setIsReady(true)
          setIsDownloadRequested(false)
          setFileDownloadName(response.fileName)
          clearInterval(interval)
        }
        if (!response.exists) {
          setIsExists(false)
          setIsDownloadRequested(false)
          clearInterval(interval)
        }
      } catch (err) {
        console.error(err)
        setIsDownloadRequested(false)
        setIsExists(false)
        clearInterval(interval)
      }
    }, 2000)
    return interval
  }

  useEffect(() => {
    setIsReady(false)
    setIsExists(true)
    setFileDownloadName(null)
    const interval = prepareLink()
    return () => clearInterval(interval)
  }, [file])

  if (!isExists) {
    return (
      <div className="tooltip tooltip-error tooltip-left" data-tip="File does not exist">
        <button disabled className={`btn btn-outline btn-disabled ${className}`}>
          {/* exclamation-triangle */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </button>
      </div>
    )
  }

  if (isReady && fileDownloadName) {
    return (
      <a
        download href={getDownloadLink(bagId, fileDownloadName)} target="_blank"
        className={`btn btn-outline btn-success ${className}`}>
        <DownloadIcon />
      </a>
    )
  }

  if (isDownloadRequested) {
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
