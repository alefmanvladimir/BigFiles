export interface FileSizeProps {
  /** Size in bytes */
  size: number
}

export default function FileSize({ size }: FileSizeProps) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"]
  const unitIndex = Math.floor(Math.log(size) / Math.log(1024))
  const unit = units[unitIndex]
  const sizeInUnit = size / Math.pow(1024, unitIndex)

  return (
    <>
      {sizeInUnit.toFixed(2)} {unit}
    </>
  )
}
