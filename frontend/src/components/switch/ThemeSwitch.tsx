import { useTheme } from '@heroui/use-theme'
import { Switch, Tooltip } from '@heroui/react'
import SunIcon from '@heroicons/react/24/solid/SunIcon'
import MoonIcon from '@heroicons/react/24/solid/MoonIcon'

export default function ThemeSwitch () {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Tooltip
      content={`${theme === 'dark' ? 'Escuro' : 'Claro'}`}
      placement='bottom'
      color='secondary'
    >
      <Switch
        isSelected={theme === 'dark'}
        onChange={toggleTheme}
        size='lg'
        color='secondary'
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <MoonIcon className={className} />
          ) : (
            <SunIcon className={className} />
          )
        }
      />
    </Tooltip>
  )
}
