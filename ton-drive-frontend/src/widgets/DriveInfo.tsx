import {useCollectionInfo} from "./hooks/useCollectionInfo";
import {fromNano} from "ton";
import {useMyCollection as useFilesCollection} from "./hooks/useMyCollection";

export interface AccountInfoProps {
  className?: string
}

export default function DriveInfo({className = ""}: AccountInfoProps) {
  const myCollection = useFilesCollection()
  const collectionInfo = useCollectionInfo()
  let balance = collectionInfo?.balance;
  return (
    <div className={"card card-compact bg-base-200 shadow-md " + className}>
      <div className="card-body">
        <h2 className="card-title">My Drive</h2>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <tbody>
              <tr>
                <th>Address</th>
                <td>{collectionInfo?.address?.toString()}</td>
              </tr>
              <tr>
                <th>Balance</th>
                <td>{balance ? <> {fromNano(balance)} TON </> : <span className="loading loading-bars loading-sm" />}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-outline btn-sm btn-primary" onClick={() => myCollection?.closeCollection()}>
            Close Collection
          </button>
          <button className="btn btn-outline btn-sm btn-secondary" onClick={() => myCollection?.createCollection()}>
            Create Collection
          </button>
        </div>
      </div>
    </div>
  )
}
