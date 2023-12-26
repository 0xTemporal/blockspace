import { Avatar, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Switch } from '@nextui-org/react'
import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'
import { useCallback } from 'react'
import { LuCog, LuLogOut, LuMessagesSquare, LuMoon, LuPenSquare, LuSun, LuUser } from 'react-icons/lu'

import { client } from '../api'

import { useDarkMode } from '../lib/hooks'
import { useUserStore } from '../state/user'

export const ProfileMenu = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const { setSession } = useUserStore()

  const wallet = useWallet()

  const handleDisconnect = useCallback(async () => {
    const session = await client.auth.logOut.mutate()
    setSession(session)
    await wallet.disconnect()
  }, [])

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button as={Avatar} isIconOnly radius="full" />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem as={Link} href={`/toly`}>
          Profile
        </DropdownItem>
        <DropdownItem as={Link} href="/messages">
          <span className="flex w-full items-center justify-between">
            <span className="flex items-center gap-x-2">Messages</span>
            <span className="mr-1 text-foreground/50">
              <Chip size="sm" color="primary">
                5
              </Chip>
            </span>
          </span>
        </DropdownItem>
        <DropdownItem as={Link} href="/journal">
          Journal
        </DropdownItem>
        <DropdownItem as={Link} href="/settings">
          Settings
        </DropdownItem>
        {/* <DropdownItem isReadOnly>
          <Button onClick={() => {}}>Toast</Button>
        </DropdownItem> */}
        <DropdownItem isReadOnly>
          <Switch
            isSelected={isDarkMode}
            onClick={toggleDarkMode}
            size="sm"
            startContent={<LuMoon />}
            endContent={<LuSun />}
            className="flex min-w-[180px] flex-row-reverse justify-between [&>span]:mr-0"
          >
            Dark Mode
          </Switch>
        </DropdownItem>
        <DropdownItem onClick={handleDisconnect}>Disconnect</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
