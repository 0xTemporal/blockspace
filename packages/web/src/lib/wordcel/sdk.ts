import { Connection } from './connection';
import { WORDCEL_PROGRAMS } from './constants';
import wordcel_idl from './idl/wordcel.json';
import { Post } from './post';
import { Profile } from './profile';
import * as anchor from '@coral-xyz/anchor';
import { Cluster } from '@solana/web3.js';
import { GraphQLClient } from 'graphql-request';

export class SDK {
  readonly program: anchor.Program;
  readonly provider: anchor.AnchorProvider;
  readonly cluster: Cluster | 'localnet';
  readonly gqlClient: GraphQLClient;

  constructor(
    wallet: anchor.Wallet,
    connection: anchor.web3.Connection,
    opts: anchor.web3.ConfirmOptions,
    cluster: Cluster | 'localnet',
    gqlClient: GraphQLClient,
  ) {
    const provider = new anchor.AnchorProvider(connection, wallet, opts);
    // @ts-ignore
    this.program = new anchor.Program(wordcel_idl as anchor.Idl, WORDCEL_PROGRAMS[cluster], provider);

    this.provider = provider;
    this.cluster = cluster;
    this.gqlClient = gqlClient;
  }

  public post = new Post(this);
  public connection = new Connection(this);
  public profile = new Profile(this);
}
