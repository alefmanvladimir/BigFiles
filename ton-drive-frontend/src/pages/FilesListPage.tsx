import FilesNavigation from "../widgets/FilesNavigation"
import FileUpload from "../widgets/FileUpload"
import {useCollectionInfo} from "../widgets/hooks/useCollectionInfo";
import {fromNano} from "ton";
import {useMyCollection} from "../widgets/hooks/useMyCollection";

export default function FilesListPage() {
    const myCollection = useMyCollection()
    const collectionInfo = useCollectionInfo()
    let balancePretty = 'Loading';
    if (collectionInfo != null) {
        balancePretty = fromNano(collectionInfo!!.balance)
    }
    return (
        <>
            <h1 className="font-bold text-3xl">My Files</h1>
            <h2>Address</h2>
            <h2>{collectionInfo?.address?.toString()}</h2>
            <h2>Balance</h2>
            <h2>{balancePretty} TON</h2>
            <button className={"btn btn-outline btn-md btn-primary"} onClick={() => myCollection?.closeCollection()}>
                Close Collection
            </button>
            <button className={"btn btn-outline btn-md btn-secondary"} onClick={() => myCollection?.createCollection()}>
                Create Collection
            </button>
            <FileUpload/>
            <FilesNavigation/>
        </>
    )
}
