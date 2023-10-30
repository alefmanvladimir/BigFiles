import { useRealtimeCollectionInfo } from "../hook/useCollectionInfo";

export interface RequireUserDriveProps {
  children?: JSX.Element | JSX.Element[];
  fallback?: JSX.Element;
}

export default function RequireUserDrive({ children, fallback = <></> }: RequireUserDriveProps) {
  const userDrive = useRealtimeCollectionInfo();

  const showChildren = userDrive != null && userDrive.balance > 0;

  return (<>
    {showChildren ? children : fallback}
  </>)
}
