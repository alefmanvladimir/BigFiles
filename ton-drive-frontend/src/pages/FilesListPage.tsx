import FilesNavigation from "../widgets/FilesNavigation"
import FileUpload from "../widgets/FileUpload"
import DriveInfo from "../widgets/DriveInfo";

export default function FilesListPage() {
  return (
    <>
      <h1 className="font-bold text-3xl">My Files</h1>
      <DriveInfo className="my-2" />
      <FileUpload/>
      <FilesNavigation/>
    </>
  )
}
