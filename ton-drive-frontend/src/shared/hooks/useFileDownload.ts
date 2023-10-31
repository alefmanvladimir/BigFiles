import {useState} from "react";

export type DownloadStatus = {
  ready: boolean,
  fileName?: string,
  downloadRequested: boolean,
  prepareLink: () => void
}

export function useFileDownload(bagId: string) {
  const [status, setStatus] =
    useState({ready: false, downloadRequested: false, fileName: null})

  return {
    ready: status.ready,
    fileName: status.fileName,
    downloadRequested: status.downloadRequested,
    prepareLink: () => {
      setStatus({ready: false, downloadRequested: true, fileName: null})
      const interval = setInterval(() => {
        fetch(`https://api.bigfiles.cloud/prepareDownload?bagId=${bagId}`, {method: 'POST'})
          .then(res => res.json())
          .then(res => {
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
    }
  }
}
