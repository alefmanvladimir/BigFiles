import {useState, useEffect} from "react";

import FilesListWithActions from "../features/file/ui/FilesListWithActions";
import FilesSortControls from "../features/file/ui/FilesSortControls";
import FilesSearchBox from "../features/file/ui/FilesSearchBox";
import {useUserFiles} from "./hooks/useUserFiles";
import {useMyCollection} from "./hooks/useMyCollection";

export default function FilesNavigation() {
    const files = useUserFiles()
    const [filteredFiles, setFilteredFiles] = useState(files)
    const [displayedFiles, setDisplayedFiles] = useState(files)

    useEffect(() => {
        setFilteredFiles(files)
        setDisplayedFiles(files)
    }, [files])
    return (
        <>
            <div className="my-2 flex gap-2 flex-wrap flex-col sm:flex-row">
                <FilesSearchBox files={files} onSearch={(foundFiles) => {
                    setFilteredFiles(foundFiles)
                    setDisplayedFiles(foundFiles)
                }}/>
                <FilesSortControls files={filteredFiles}
                                   onSort={(sortedFiles) => setDisplayedFiles(sortedFiles)}/>
            </div>
            <FilesListWithActions files={displayedFiles}/>
        </>
    )
}
