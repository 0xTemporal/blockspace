import { web3 } from '@coral-xyz/anchor';

export const WORDCEL_PROGRAMS = {
  'mainnet-beta': new web3.PublicKey('EXzAYHZ8xS6QJ6xGRsdKZXixoQBLsuMbmwJozm85jHp'),
  devnet: new web3.PublicKey('D9JJgeRf2rKq5LNMHLBMb92g4ZpeMgCyvZkd7QKwSCzg'),
  localnet: new web3.PublicKey('6bxpSrHAc9zoWHKLJX3sfudTarFaHZoKQbM2XsyjJpMF'),
};

export const WORDCEL_INVITE_PROGRAMS = {
  'mainnet-beta': new web3.PublicKey('Fc4q6ttyDHr11HjMHRvanG9SskeR24Q62egdwsUUMHLf'),
  devnet: new web3.PublicKey('FkxEua5pdkwXHpbYMTZcEUW9UuxQPQiCMZQFyuaVJ2uc'),
  localnet: new web3.PublicKey('FkxEua5pdkwXHpbYMTZcEUW9UuxQPQiCMZQFyuaVJ2uc'),
};

export const SEED_PREFIXES = {
  post: Buffer.from('post'),
  profile: Buffer.from('profile'),
  connection: Buffer.from('connection'),
  invite: Buffer.from('invite'),
};
