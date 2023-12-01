import { DialectSolanaWalletAdapter, Solana, SolanaSdkFactory } from '@dialectlabs/blockchain-sdk-solana';
import {
  CreateThreadCommand,
  Dialect,
  DialectCloudEnvironment,
  DialectSdk,
  FindThreadByIdQuery,
  Thread,
} from '@dialectlabs/sdk';
import { Wallet, WalletContextState } from '@solana/wallet-adapter-react';

const environment: DialectCloudEnvironment = 'development';

export class DialectSDK {
  readonly sdk: DialectSdk<Solana>;

  constructor(wallet: Wallet) {
    this.sdk = createDialectSdk(wallet);
  }

  getAllThreads = async () => await this.sdk.threads.findAll();

  getThread = async (query: FindThreadByIdQuery) => await this.sdk.threads.find(query);

  createThread = async (command: CreateThreadCommand) => await this.sdk.threads.create(command);

  deleteThread = async (thread: Thread) => await thread.delete();
}

const createDialectSdk = (wallet: Wallet) =>
  Dialect.sdk(
    {
      environment,
    },
    SolanaSdkFactory.create({
      wallet,
    }),
  );

export const solanaWalletToDialectWallet = (wallet: WalletContextState): DialectSolanaWalletAdapter | null => {
  if (!wallet.connected || wallet.connecting || wallet.disconnecting || !wallet.publicKey) {
    return null;
  }

  return {
    publicKey: wallet.publicKey!,
    signMessage: wallet.signMessage,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
    // @ts-ignore
    diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
      ? async (pubKey: any) => {
          // @ts-ignore
          return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
        }
      : undefined,
  };
};
