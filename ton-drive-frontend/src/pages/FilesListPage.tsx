import SortableFilesList from "../features/file/ui/SortableFilesList"

export default function FilesListPage() {
  return (
    <>
      <h1 className="font-bold text-3xl">My Files</h1>
      <SortableFilesList />
    </>
  )
}
