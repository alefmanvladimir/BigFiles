import FilesList from "../../../entities/file/ui/FilesList";
import { useUserFiles } from "../hooks/useUserFile";

export default function SortableFilesList() {
  const files = useUserFiles();

  return (
    <FilesList files={files} />
  )
}
