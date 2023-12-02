import { SEED_PREFIXES, WORDCEL_PROGRAMS } from './constants'
import { SDK } from './sdk'
import { web3 } from '@coral-xyz/anchor'
import { gql } from 'graphql-request'

export class Connection {
  readonly sdk: SDK

  constructor(sdk: SDK) {
    this.sdk = sdk
  }
  /**
   * Return's the PDA Derived from the provided Inputs
   *
   * @remarks
   *
   *
   * @param follower - The address who wants to follow
   * @param profileToFollow  - The Profile PDA of the address to follow
   * @returns A Connection PDA Address
   *
   * @beta
   */
  connectionPDA(follower: web3.PublicKey, profileToFollow: web3.PublicKey) {
    return web3.PublicKey.findProgramAddressSync(
      [SEED_PREFIXES['connection'], follower.toBuffer(), profileToFollow.toBuffer()],
      // @ts-ignore
      WORDCEL_PROGRAMS[this.sdk.cluster],
    )
  }

  /**
   * Return's the List of all the posts for a user Publickey
   *
   * @remarks
   *
   *
   * @param user - Publickey of the User
   *
   * @beta
   */
  getAllConnectionPostsGQL(user: web3.PublicKey) {
    // TODO: Add order by and pagination
    const query = gql`
        query getAllPostsOfYourConnections {
          wordcel_0_1_1_decoded_connection(
            where: {
              authority: { _eq: "${user}" }
            }
          ) {
            authority
            profile
            profile_in_connection {
              authority
              cl_pubkey
              posts_inside_profile {
                metadatauri
              }
            }
          }
        }
      `
    return this.sdk.gqlClient.request(query)
  }

  /**
   * Fetches the User address of all the addresses followed by a user
   *
   * @remarks
   * This Function uses the indexed data and is more efficient in querying it
   *
   *
   * @param user - User Publickey
   *
   * @returns the addresses of all the users follower by a user Pubkey
   *
   * @beta
   */
  getConnections(user: web3.PublicKey) {
    const query = gql`
          query getConnectionsByUser {
              wordcel_0_1_1_decoded_connection(
              where: {authority: {_eq: "${user}"}}
              ) {
                  profile
                  authority
                  cl_pubkey
              }
        }
      `
    return this.sdk.gqlClient.request(query)
  }

  /**
   * Incoming Connections for a Profile PDA
   *
   * @remarks
   * This Function uses the indexed data and is more efficient in querying it
   *
   *
   * @param profile - The Profile PDA pubkey
   *
   * @returns Data of all the Connections for a Profile PDA
   *
   * @beta
   */
  getConnectionsByProfileGQL(profile: web3.PublicKey) {
    const query = gql`
          query getConnectionsByUser {
              wordcel_0_1_1_decoded_connection(
              where: {profile: {_eq: "${profile}"}}
              ) {
                  authority
                  cl_pubkey
                  profile
              }
        }
      `
    return this.sdk.gqlClient.request(query)
  }

  /**
   * Return's the data of the Connection PDA Account
   *
   * @remarks
   *
   *
   * @param follower - The address who wants to follow
   * @param profileToFollow  - The Profile PDA of the address to follow
   * @returns The data of the connection PDA Account
   */
  getConnectionPDAData(account: web3.PublicKey) {
    return this.sdk.program.account.connection?.fetch(account)
  }

  /**
   * Return's the Transaction Signature
   *
   * @remarks
   * This is used to follow a Profile
   *
   * @param follower - The address who wants to follow
   * @param profileToFollow  - The Profile PDA of the address to follow
   * @returns The Transaction Signature
   *
   *
   * @beta
   */
  async createConnection(follower: web3.PublicKey, profileToFollow: web3.PublicKey) {
    const [connectionAccount, _] = await this.connectionPDA(follower, profileToFollow)
    return this.sdk.program.methods
      .initializeConnection?.()
      .accounts({
        connection: connectionAccount,
        profile: profileToFollow,
        authority: follower,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction()
  }

  /**
   * Return's the Transaction Signature
   *
   * @remarks
   * This is used to Unfollow a Profile
   *
   * @param follower - The address who wants to unfollow
   * @param profileToFollow  - The Profile PDA of the address to unfollow
   * @returns The Transaction Signature
   *
   * @beta
   */
  async closeConnection(follower: web3.PublicKey, profileToFollow: web3.PublicKey) {
    const [connectionAccount, _] = await this.connectionPDA(follower, profileToFollow)
    return this.sdk.program.methods
      .closeConnection?.()
      .accounts({
        connection: connectionAccount,
        profile: profileToFollow,
        authority: follower,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction()
  }
}
