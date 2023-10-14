import { useState } from "react"
import type { TonStorageFile } from "../../../entities/file/model/TonStorageFile"

export interface FilesSortControlProps {
  files: TonStorageFile[]
  onSort?: (sortedFiles: TonStorageFile[]) => void
}

type SortAttribute = 'name' | 'date' | 'size'

export default function FilesSortControls({ files, onSort }: FilesSortControlProps){
  const [areDatesAscending, setAreDatesAscending] = useState(false)
  const [areNamesAscending, setAreNamesAscending] = useState(true)
  const [areSizesAscending, setAreSizesAscending] = useState(true)
  const [sortAttribute, setSortAttribute] = useState<SortAttribute | null>(null)

  return (
    <>
      <div className="join">
        <button className={`btn join-item ${sortAttribute === 'date' ? 'btn-active' : ''}`} onClick={() => onButtonClick('date')}>
          <SortOrderIcon asc={areDatesAscending} /> Date
        </button>
        <button className={`btn join-item ${sortAttribute === 'name' ? 'btn-active' : ''}`} onClick={() => onButtonClick('name')}>
          <SortOrderIcon asc={areNamesAscending} /> Name
        </button>
        <button className={`btn join-item ${sortAttribute === 'size' ? 'btn-active' : ''}`} onClick={() => onButtonClick('size')}>
          <SortOrderIcon asc={areSizesAscending} /> Size
        </button>
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
            ▲
          </>:
          <>
            ▼
          </>
      }
    </>
  )
}
