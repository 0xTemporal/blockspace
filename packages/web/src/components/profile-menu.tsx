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
          <span className="flex w-full items-center justify-between">
            Profile
            <span className="mr-1 text-foreground/50">
              <LuUser />
            </span>
          </span>
        </DropdownItem>
        <DropdownItem as={Link} href="/messages">
          <span className="flex w-full items-center justify-between">
            <span className="flex items-center gap-x-2">
              Messages
              <Chip size="sm" color="primary">
                5
              </Chip>
            </span>
            <span className="mr-1 text-foreground/50">
              <LuMessagesSquare />
            </span>
          </span>
        </DropdownItem>
        <DropdownItem as={Link} href="/journal">
          <span className="flex w-full items-center justify-between">
            Journal
            <span className="mr-1 text-foreground/50">
              <LuPenSquare />
            </span>
          </span>
        </DropdownItem>
        <DropdownItem as={Link} href="/settings">
          <span className="flex w-full items-center justify-between">
            Settings
            <span className="mr-1 text-foreground/50">
              <LuCog />
            </span>
          </span>
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
        <DropdownItem onClick={handleDisconnect}>
          <span className="flex w-full items-center justify-between">
            Disconnect
            <span className="mr-1 text-foreground/50">
              <LuLogOut />
            </span>
          </span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
