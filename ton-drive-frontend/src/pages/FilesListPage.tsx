import FilesNavigationCard from "../widgets/FilesNavigationCard"
import FileUpload from "../widgets/FileUpload"
import DriveInfoCard from "../widgets/DriveInfoCard";

export default function FilesListPage() {
  return (
    <>
      <DriveInfoCard className="my-2" />
      <FileUpload/>
      <FilesNavigationCard className="my-2"/>
    </>
  )
}
