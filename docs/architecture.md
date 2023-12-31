# TON Drive Architecture

**TON Drive** functionality should be built around the [TON Storage](https://docs.ton.org/participate/ton-storage/storage-daemon) and the [Storage Provider](https://docs.ton.org/participate/ton-storage/storage-provider). In order to implement this functionality 3 high level components are required:
1. **Telegram Web Application** - frontend part with interface for user interaction
2. **Files Uploader** - backend part for uploading files to TON Storage
3. **Files Database** - set of smart contracts for storing files metadata

![TON Drive Architecture](./images/high-level-architecture.jpg)

> Original file is hosted [there](https://drive.google.com/file/d/1FfCCwNm0a8AX4yYIrqrhrEIS1i8xgq7Q/view?usp=sharing).

## Components

### Telegram Web Application

Simple [telegram web application](https://core.telegram.org/bots/webapps) with following functionality:
1. Browsing your files
2. Uploading files
3. Sharing files

### Files Uploader

TON Storage works like the torrent and it is available only on Desktop OS. So, in order to upload files from mobile devices we need to implement a backend part that will upload files to TON Storage.

> Backend should keep files until they are handled by the Storage Provider.

Also it will be convenient to create files metadata on the backend side.

### Files Database

Some smart contracts for storing files metadata.

```mermaid
---
title: Basic traits
---
classDiagram
    class Deployable
    class Ownable {
      - owner: address
      + get owner()
      - requireOwner()
    }
    class OwnableTransferable {
      - owner: address
      + ChangeOwner(newOwner: address)
    }
    Ownable <|-- OwnableTransferable
```

> All smart contracts should extend `Deployable` and `OwnableTransferable` traits.

```mermaid
---
title: Smart Contracts
---
classDiagram
    class TonDriveMaster {
      - owner: address[admin]
      - personalDriveCount: int
      + get PersonalDriveCount(): int
      + get PersonalDriveAddress(index: int): address[TonDrivePersonalDrive]
    }

    class TonDrivePersonalDrive {
      - owner: address[user]
      - filesStoredCount: int
      - tonDriveMasterAddress: address[TonDriveMaster]
      + get Owner(): address[user]
      + get FilesStoredCount(): int
      + get FileAddress(index: int): address[TonDriveFile]
      + get TonDriveMasterAddress(): address[TonDriveMaster]
    }

    class TonDriveFile {
      - owner: address[user]
      - driveAddress: address[TonDrivePersonalDrive]
      - bagId: string
      - name: string
      - size: int
      + get DriveAddress(): address[TonDrivePersonalDrive]
      + get Owner(): address[user]
      + get BagId(): string
      + get Name(): string
      + get Size(): int
    }

    TonDriveMaster "1" o-- "*" TonDrivePersonalDrive
    TonDrivePersonalDrive "1" o-- "*" TonDriveFile
```

## Light Architecture

While we are making first steps in development, it is possible to use only the backend server as TON storage for the whole system.

In this case:

1. Backend doesn't create smart contract for Storage Provider
2. Backend keeps all files in drive and doesn't delete them

![Architecture Light](./images/architecture-light.jpg)

## User Stories

### Uploading files

1. User uploads file to the backend
2. Backend shares file with the TON Storage participants
3. Backend extracts file metadata
4. Backend creates smart contract with TON Storage Provider for storing file in the TON Storage
5. Backend stores file metadata in the smart contract
6. Backend returns file metadata to the user

> When file is handled by the Storage Provider, backend can delete local copy of the file.

```mermaid
---
title: Uploading files
---
sequenceDiagram
    participant Frontend
    participant Backend
    participant TS as TON Storage
    participant TSP as TON Storage Provider
    participant FDB as Files Database

    Frontend->>+Backend: Upload file
    Backend->>TS: Share file
    Backend->>Backend: Extract file metadata
    Backend->>+TSP: Create file storage contract
    TSP-->>-Backend: File storage contract address
    Backend->>+FDB: Store file metadata
    FDB-->>-Backend: File metadata stored
    Backend-->>-Frontend: File metadata

    loop Every 24 hours
        alt File is handled by storage provider
            Backend->>Backend: Delete local copy of the file
        end
    end
```

### Browsing files

1. Frontend requests drive metadata from the Files Database
2. Frontend requests file metadata for each file in drive from the Files Database
3. Frontend displays files metadata to the user

```mermaid
---
title: Browsing files
---
sequenceDiagram
    participant Frontend
    participant FDB as Files Database

    Frontend->>+FDB: Get drive metadata
    FDB-->>-Frontend: Drive metadata
    par for each file in drive
        Frontend->>+FDB: Get file metadata
        FDB-->>-Frontend: File metadata
    end
    Frontend->>Frontend: Display files metadata
```

### Downloading files

1. If `bagId` or `filename` are unknown, Frontend requests file metadata from the Files Database
2. Frontend downloads file from the TON Storage by URL

```mermaid
---
title: Downloading files
---
sequenceDiagram
    participant Frontend
    participant TS as TON Storage
    participant FDB as Files Database

    alt bagId or filename are unknown
        Frontend->>+FDB: Get file metadata
        FDB-->>-Frontend: File metadata
    end

    Frontend->>+TS: Download file by URL
    TS-->>-Frontend: File
```

## Possible problems

1. **Privacy**: TON Storage is a public network, so anyone can download your files if they know `bagId` and `filename`. 
   
   > **Added by GitHub Copilot**: We can solve this problem by encrypting files before uploading them to the TON Storage. In this case only users with decryption keys will be able to download files.
