import { ReactNode } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

type RoundButtonProps = TouchableOpacityProps & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary'
}

const variants = {
  primary: 'bg-green-500',
  secondary: 'bg-red-500',
  tertiary: 'bg-purple-500',
}

export function RoundButton({ children, variant, ...rest }: RoundButtonProps) {
  return (
    <TouchableOpacity
      className={`h-10 w-10 items-center justify-center rounded-full ${
        variants[variant || 'primary']
      } `}
      activeOpacity={0.8}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}
