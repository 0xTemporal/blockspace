import { Button, ButtonProps, CircularProgress } from '@nextui-org/react';
import { useWalletConnectButton } from '@solana/wallet-adapter-base-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletIcon, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';

import { signInWithSolana } from '../lib/siws';

export const WalletConnectButton = ({ children, disabled, ...props }: ButtonProps) => {
  const { setVisible } = useWalletModal();
  const { walletIcon, walletName } = useWalletConnectButton();
  const { publicKey, signMessage, connect } = useWallet();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (walletName !== undefined) {
      connect();
    }
  }, [connect, walletName]);

  const signIn = useCallback(async () => {
    setConnecting(true);
    await toast.promise(
      signInWithSolana(publicKey!, signMessage!),
      {
        loading: 'connecting',
        success: 'Success',
        error: 'Error',
      },
      { loading: { icon: <CircularProgress size="sm" /> } },
    );
    setConnecting(false);
  }, [publicKey, signMessage]);

  return walletName === undefined ? (
    <Button
      color="primary"
      {...props}
      onClick={() => {
        setVisible(true);
      }}
    >
      Select Wallet
    </Button>
  ) : (
    <Button {...props} onClick={signIn} color="primary" isLoading={connecting}>
      {walletIcon && walletName && !connecting ? (
        <span className="h-6 w-6">
          <WalletIcon wallet={{ adapter: { icon: walletIcon, name: walletName } }} />
        </span>
      ) : undefined}
      {connecting ? 'Connecting' : 'Connect'}
    </Button>
  );
};
