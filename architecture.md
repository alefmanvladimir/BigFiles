# TON Drive Architecture

**TON Drive** functionality should be built around the [TON Storage](https://docs.ton.org/participate/ton-storage/storage-daemon) and the [Storage Provider](https://docs.ton.org/participate/ton-storage/storage-provider). In order to implement this functionality 3 high level components are required:
1. **Telegram Web Application** - frontend part with interface for user interaction
2. **Files Uploader** - backend part for uploading files to TON Storage
3. **Files Database** - set of smart contracts for storing files metadata

![TON Drive Architecture](./images/high-level-architecture.jpg)

> Original file is hosted [there](https://drive.google.com/file/d/1FfCCwNm0a8AX4yYIrqrhrEIS1i8xgq7Q/view?usp=sharing).

