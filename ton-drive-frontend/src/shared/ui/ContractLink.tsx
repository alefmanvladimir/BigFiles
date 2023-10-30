export interface ContractLinkProps {
  className?: string
  address: string
}

export default function ContractLink({className, address}: ContractLinkProps) {
  return (
    <a
      href={`https://tonscan.org/address/${address}`}
      target="_blank"
      className={`link link-primary ${className ?? ''}`}
    >
      {address}
    </a>
  )

}
