import { useTheme } from 'next-themes'

export const useDarkMode = () => {
  const { setTheme, theme } = useTheme()

  const isDarkMode = theme === 'dark'

  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark')

  return { isDarkMode, toggleDarkMode }
}
