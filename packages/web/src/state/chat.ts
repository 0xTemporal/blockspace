'use client';

import { useDialectSdk } from '@dialectlabs/react-sdk';

export const useChat = () => {
  const sdk = useDialectSdk();

  return { sdk };
};
