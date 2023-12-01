'use client';

import { SignedIn } from './signed-in';
import { useWallet } from '@solana/wallet-adapter-react';

import { useChat } from '@/src/state/chat';

export function MessagesView() {
  const { publicKey } = useWallet();

  return publicKey ? <SignedIn /> : <div>Please connect</div>;
}
