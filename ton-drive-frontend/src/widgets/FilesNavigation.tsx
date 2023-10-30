import ExpandedFilesListWithActions from "../features/file/ui/ExpandedFilesListWithActions";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import FilesSearchBox from "../features/file/ui/FilesSearchBox";
import { useUserFilesWithControls } from "./hooks/useUserFilesWithControls";

export default function FilesNavigation() {
    const {
      files,
      dataToFilter, dataToSort,
      onFilter, onSort
    } = useUserFilesWithControls()
    return (
        <>
            <div className="my-2 flex gap-2 flex-wrap flex-col sm:flex-row">
                <FilesSearchBox files={dataToFilter} onSearch={onFilter}/>
                <FilesSortControls files={dataToSort} onSort={onSort}/>
            </div>
            <ExpandedFilesListWithActions files={files}/>
        </>
    )
}
