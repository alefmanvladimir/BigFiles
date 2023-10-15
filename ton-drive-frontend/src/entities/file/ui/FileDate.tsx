export interface FileDateProps {
  date: Date;
}

export default function FileDate({ date }: FileDateProps) {
  // display date in format: 2021-08-31 12:00:00
  return (
    <>
      {date.toLocaleDateString()} {/*date.toLocaleTimeString()*/}
    </>
  );
}
