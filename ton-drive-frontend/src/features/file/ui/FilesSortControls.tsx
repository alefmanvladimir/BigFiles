import { useState, useEffect } from "react"
import type { TonStorageFile } from "../../../entities/file/model/TonStorageFile"

export interface FilesSortControlProps {
  className?: string
  files: TonStorageFile[]
  onSort?: (sortedFiles: TonStorageFile[]) => void
}

type SortAttribute = 'name' | 'date' | 'size'

export default function FilesSortControls({ files, onSort, className = '' }: FilesSortControlProps){
  const [areDatesAscending, setAreDatesAscending] = useState(false)
  const [areNamesAscending, setAreNamesAscending] = useState(true)
  const [areSizesAscending, setAreSizesAscending] = useState(true)
  const [sortAttribute, setSortAttribute] = useState<SortAttribute | null>(null)

  useEffect(() => {
    setAreDatesAscending(false)
    setAreNamesAscending(true)
    setAreSizesAscending(true)
    setSortAttribute(null)
  }, [files])

  const buttons: {
    sortAttribute: SortAttribute,
    text: string
  }[] = [
    { sortAttribute: 'date', text: 'Date' },
    { sortAttribute: 'name', text: 'Name' },
    { sortAttribute: 'size', text: 'Size' },
  ]

  function getAsc(sortAttribute: SortAttribute): boolean {
    switch (sortAttribute) {
      case 'date':
        return areDatesAscending
      case 'name':
        return areNamesAscending
      case 'size':
        return areSizesAscending
    }
  }

  return (
    <>
      <div className={`join ${className}`}>
        {
          buttons.map((buttonModel) => (
            <button key={buttonModel.sortAttribute}
                    className={`btn btn-sm sm:btn-md join-item ${sortAttribute === buttonModel.sortAttribute ? 'btn-active btn-accent' : ''}`}
                    onClick={() => onButtonClick(buttonModel.sortAttribute)}>
              <SortOrderIcon asc={getAsc(buttonModel.sortAttribute)} /> {buttonModel.text}
            </button>
          ))
        }
      </div>
    </>
  )

  function onButtonClick (clickedAttribute: SortAttribute) {
    const asc = {
      date: areDatesAscending,
      name: areNamesAscending,
      size: areSizesAscending,
    }
    if (sortAttribute === clickedAttribute) {
      switch (clickedAttribute) {
        case 'name':
          setAreNamesAscending(!areNamesAscending)
          asc.name = !areNamesAscending
          break
        case 'date':
          setAreDatesAscending(!areDatesAscending)
          asc.date = !areDatesAscending
          break
        case 'size':
          setAreSizesAscending(!areSizesAscending)
          asc.size = !areSizesAscending
          break
      }
    }
    setSortAttribute(clickedAttribute)
    sortFiles(clickedAttribute, asc)
  }

  // Without parameters, this function works awfully, because of react batching
  function sortFiles(by: SortAttribute, asc: {
    date: boolean,
    name: boolean,
    size: boolean,
  }) {
    const sortedFiles = [...files]
    function getCompareFunction(): (a: TonStorageFile, b: TonStorageFile) => number {
      if (by === 'name') {
        if (asc.name) {
          return (a, b) => a.name.localeCompare(b.name)
        } else {
          return (a, b) => b.name.localeCompare(a.name)
        }
      }
      if (by === 'date') {
        if (asc.date) {
          return (a, b) => Number(a.date) - Number(b.date)
        } else {
          return (a, b) => Number(b.date) - Number(a.date)
        }
      }
      if (by === 'size') {
        if (asc.size) {
          return (a, b) => a.size - b.size
        } else {
          return (a, b) => b.size - a.size
        }
      }
      console.error(`Unknown sort attribute: ${sortAttribute}`)
      return (a, b) => 0
    }
    sortedFiles.sort(getCompareFunction())
    if (onSort) {
      onSort(sortedFiles)
    }
  }
}

interface SortOrderIconProps {
  /** Is ascending */
  asc: boolean
}

function SortOrderIcon({ asc }: SortOrderIconProps) {
  return (
    <>
      {
        asc ?
          <>
            {/* arrow up */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
            </svg>
          </>:
          <>
            {/* arrow down */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
            </svg>
          </>
      }
    </>
  )
}
