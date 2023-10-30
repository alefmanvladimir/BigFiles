import type { TonStorageFile } from "../model/TonStorageFile";
import FileSize from "./FileSize";
import FileDate from "./FileDate";
import FileTypeIcon from "./FileTypeIcon";

export interface FilesListItemProps {
  file: TonStorageFile;
  className?: string;
  onClick?: (file: TonStorageFile) => void;
}

export default function FilesListItem({ file, className = "", onClick }: FilesListItemProps) {
  function handleClick(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) {
    if (onClick) {
      onClick(file);
    }
  }

  return (
    <tr className={`${onClick ? 'hover cursor-pointer' : ''} ${className}`} onClick={handleClick}>
      <td>
        <FileTypeIcon extension={file.extension} />
      </td>
      <th className="font-bold">
        {file.name}.{file.extension}
      </th>
      <td>
        <time>
          <FileDate date={file.date} />
        </time>
      </td>
      <td>
        <FileSize size={file.size} />
      </td>
    </tr>
  );
}
