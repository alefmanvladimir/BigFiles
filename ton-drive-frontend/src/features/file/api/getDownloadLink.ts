import { apiConfig } from "../../../shared/config/api"

export function getDownloadLink(bagId: string, fileName: string): string {
  return new URL(`download/${bagId}/${fileName}`, apiConfig.baseUrl).toString()
}
