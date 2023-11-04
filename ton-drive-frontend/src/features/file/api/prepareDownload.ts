import { apiConfig } from "../../../shared/config/api";

export type PrepareDownloadResponse = {
  ready: boolean
  exists: boolean
  fileName: string | null
  _output?: string | object
}

export async function prepareDownload(bagId: string): Promise<PrepareDownloadResponse> {
  const resRaw = await fetch(new URL(`prepareDownload?bagId=${bagId}`, apiConfig.baseUrl).toString(), {
    method: 'POST'
  })
  const res: PrepareDownloadResponse = await resRaw.json()
  return res
}
