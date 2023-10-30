import FilesNavigationCard from "../widgets/FilesNavigationCard"
import FileUploadCard from "../widgets/FileUploadCard"
import DriveInfoCard from "../widgets/DriveInfoCard";
import RequireUserDrive from "../features/drive/ui/RequireUserDrive";

export default function DriveDashboard() {
  return (
    <>
      <section className="grid items-start xl:grid-cols-[500px_1fr] gap-2 md:gap-3 xl:gap-5">
        <div className="grid items-start gap-2 md:grid-cols-2 md:gap-3 grid-cols-1 xl:gap-5">
          <DriveInfoCard />
          <RequireUserDrive>
            <FileUploadCard />
          </RequireUserDrive>
        </div>
        <RequireUserDrive>
          <FilesNavigationCard />
        </RequireUserDrive>
      </section>
    </>
  )
}
