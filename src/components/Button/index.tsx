import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native'

type ButtonProps = TouchableOpacityProps & {
  isLoading?: boolean
  title: string
  variant?: 'primary' | 'secondary'
}

export function Button({
  isLoading,
  title,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`items-center rounded-full px-5 py-3 ${
        variant === 'primary' ? 'bg-green-500' : 'bg-red-500'
      }`}
      style={{ opacity: isLoading ? 0.5 : 1 }}
      disabled={isLoading}
      {...rest}
    >
      {isLoading && (
        <ActivityIndicator
          className="absolute top-1/2"
          color={variant === 'primary' ? '#000' : '#8257e5'}
          size={24}
        />
      )}
      <Text
        className={`font-alt text-sm uppercase ${
          variant === 'primary' ? 'text-black' : 'text-gray-50'
        } ${isLoading && 'opacity-0'}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}
