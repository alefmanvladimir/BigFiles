import FilesNavigationCard from "../widgets/FilesNavigationCard"
import FileUploadCard from "../widgets/FileUploadCard"
import DriveInfoCard from "../widgets/DriveInfoCard";
import RequireUserDrive from "../features/drive/ui/RequireUserDrive";

export default function FilesListPage() {
  return (
    <>
      <DriveInfoCard className="my-2" />
      <RequireUserDrive>
        <FileUploadCard className="my-2" />
        <FilesNavigationCard className="my-2"/>
      </RequireUserDrive>
    </>
  )
}
