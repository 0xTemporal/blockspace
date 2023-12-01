'use client';

import { ProfileMenu } from './profile-menu';
import { WalletConnectButton } from './wallet-connect-button';
import { Badge, Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { LuMoon, LuSun } from 'react-icons/lu';

import { useDarkMode } from '../lib/hooks';

export const NavBar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const session = useSession();

  const { connected, publicKey } = useWallet();

  // const { result } = useFavoriteDomain(connection, publicKey?.toBase58());
  // const pfp = useProfilePic(connection, `${result?.domain!}.sol`);

  const notificationCount: number = 5;

  return (
    <Navbar shouldHideOnScroll maxWidth="full">
      <NavbarBrand>
        <Link href="/" className="font-light tracking-[0.5em] text-foreground" color="foreground">
          blockspace.
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        {session.status === 'authenticated' && connected ? (
          <NavbarItem>
            {notificationCount > 0 ? (
              <Badge content={notificationCount} color="primary" classNames={{ base: 'mt-2' }}>
                <ProfileMenu />
              </Badge>
            ) : (
              <ProfileMenu />
            )}
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <Button isIconOnly onClick={toggleDarkMode}>
                {isDarkMode ? <LuSun /> : <LuMoon />}
              </Button>
            </NavbarItem>
            <NavbarItem>
              <WalletConnectButton />
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};
