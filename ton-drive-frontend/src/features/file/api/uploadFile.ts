import { apiConfig } from "../../../shared/config/api";

export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(new URL('upload', apiConfig.baseUrl), {
      method: 'POST',
      body: formData
  })

  const {bagId} = await response.json() as {bagId: string}
  return bagId
}
