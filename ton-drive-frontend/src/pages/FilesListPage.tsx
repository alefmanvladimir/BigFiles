import FilesNavigation from "../widgets/FilesNavigation"
import FileUpload from "../widgets/FileUpload"

export default function FilesListPage() {
  return (
    <>
      <h1 className="font-bold text-3xl">My Files</h1>
      <FileUpload />
      <FilesNavigation />
    </>
  )
}
