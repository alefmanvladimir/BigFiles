import { useState } from 'react'
import type { TonStorageFile } from "../../../entities/file/model/TonStorageFile"

export interface FilesSearchBoxProps {
  className?: string
  files: TonStorageFile[]
  onSearch?: (foundFiles: TonStorageFile[]) => void
}

export default function FilesSearchBox({ files, onSearch, className = '' }: FilesSearchBoxProps) {
  const isNew = false

  const [searchQuery, setSearchQuery] = useState('')

  function searchFiles (query: string) {
    const foundFiles = query ? files.filter(file => file.name.includes(query)) : [...files]
    if (onSearch) {
      onSearch(foundFiles)
    }
  }

  function onSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    searchFiles(searchQuery)
  }

  return (
    <form className={`join ${className}`} onSubmit={onSubmit}>
      <input className="input input-bordered join-item" placeholder="Search"
              value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
      <div className="indicator">
        { isNew ? <span className="indicator-item badge badge-accent">new</span> : null }
        <button className="btn join-item btn-outline" type="submit">
          {/* magnifying-glass */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>
    </form>
  )
}
