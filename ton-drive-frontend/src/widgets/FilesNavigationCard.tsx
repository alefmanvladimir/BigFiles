import ExapndedFilesListWithActions from "../features/file/ui/ExpandedFilesListWithActions";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import FilesSearchBox from "../features/file/ui/FilesSearchBox";
import { useUserFilesWithControls } from "./hooks/useUserFilesWithControls";

export interface FilesNavigationProps {
  className?: string
}

export default function FilesNavigationCard({className = ""}: FilesNavigationProps) {
  const {
    files,
    dataToFilter, dataToSort,
    onFilter, onSort
  } = useUserFilesWithControls()

  return (
    <div className={`card card-compact sm:card-normal bg-base-200 ${className}`}>
      <div className="card-body">
        <h2 className="card-title">Files</h2>
        <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
          <FilesSearchBox files={dataToFilter} onSearch={onFilter}/>
          <FilesSortControls files={dataToSort} onSort={onSort}/>
        </div>
        <ExapndedFilesListWithActions files={files}/>
      </div>
    </div>
  )
}
