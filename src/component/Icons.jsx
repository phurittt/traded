function Icon({ children, className = 'size-6', filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z" />
  </Icon>
)
export const MarketIcon = (p) => (
  <Icon {...p}>
    <path d="M4 19h16M6 15l4-5 3 3 5-7" />
  </Icon>
)
export const PortfolioIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3a9 9 0 109 9h-9z" />
    <path d="M16 3.8A9 9 0 0120.2 8H16z" />
  </Icon>
)
export const ActivityIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
)
export const UserIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.500 2 8 6" />
  </Icon>
)
export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.800-3.800" />
  </Icon>
)
export const EyeIcon = (p) => (
  <Icon {...p}>
    <path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)
export const EyeOffIcon = (p) => (
  <Icon {...p}>
    <path d="M3 3l18 18M10.600 5.100A10 10 0 0112 5c6.400 0 10 7 10 7a17 17 0 01-3.200 4M6.500 6.600A16 16 0 002 12s3.600 7 10 7a10 10 0 005-1.400" />
    <path d="M9.900 9.900a3 3 0 004.200 4.200" />
  </Icon>
)
export const StarIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3.500l2.600 5.400 5.900.8-4.300 4.100 1 5.900-5.200-2.800-5.200 2.800 1-5.900-4.300-4.100 5.900-.8z" />
  </Icon>
)
export const BackIcon = (p) => (
  <Icon {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Icon>
)
export const ChevronIcon = (p) => (
  <Icon {...p}>
    <path d="M9 5l7 7-7 7" />
  </Icon>
)
export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
)
export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12.500l4.500 4.500L19 7.500" />
  </Icon>
)
export const DepositIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
  </Icon>
)
export const WithdrawIcon = (p) => (
  <Icon {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
  </Icon>
)
