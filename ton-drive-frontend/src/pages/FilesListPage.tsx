import FilesNavigationCard from "../widgets/FilesNavigationCard"
import FileUploadCard from "../widgets/FileUploadCard"
import DriveInfoCard from "../widgets/DriveInfoCard";

export default function FilesListPage() {
  return (
    <>
      <DriveInfoCard className="my-2" />
      <FileUploadCard className="my-2" />
      <FilesNavigationCard className="my-2"/>
    </>
  )
}
