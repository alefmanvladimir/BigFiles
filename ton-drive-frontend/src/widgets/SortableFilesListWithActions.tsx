import FilesListWithActions from "../features/file/ui/FilesListWithActions";
import { useUserFiles } from "./hooks/useUserFile";

export default function SortableFilesListWithActions() {
  const files = useUserFiles()
  return (
    <>
      <FilesListWithActions files={files} />
    </>
  )
}
