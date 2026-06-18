import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const VARIANT: Record<Variant,string> = {
  primary:   'btn-primary text-white font-semibold',
  secondary: 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors',
  ghost:     'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--bg-hover)] transition-colors',
  danger:    'bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/20 transition-colors',
}
const SIZE: Record<Size,string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
}

export default function Button({ variant='primary', size='md', children, fullWidth=false, loading=false, className='', disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${fullWidth?'w-full':''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}
