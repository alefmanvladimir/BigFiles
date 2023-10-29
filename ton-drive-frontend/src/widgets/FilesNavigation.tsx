import {useState, useEffect} from "react";

import FilesListWithActions from "../features/file/ui/FilesListWithActions";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import FilesSearchBox from "../features/file/ui/FilesSearchBox";
import {useUserFiles} from "./hooks/useUserFiles";
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
            <FilesListWithActions files={files}/>
        </>
    )
}
