import { SEED_PREFIXES, WORDCEL_PROGRAMS } from './constants'
import { SDK } from './sdk'
import * as anchor from '@coral-xyz/anchor'
import { gql } from 'graphql-request'
import randombytes from 'randombytes'

const { SystemProgram } = anchor.web3
export class Post {
  readonly sdk: SDK

  constructor(sdk: SDK) {
    this.sdk = sdk
  }

  /**
   * Get a PDA with seeds post and randomHash
   *
   * @remarks
   * This PDA stores the on-chain details related to a post
   *
   *
   * @beta
   */
  postPDA(randomHash: Buffer) {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [SEED_PREFIXES['post'], randomHash],
      // @ts-ignore
      WORDCEL_PROGRAMS[this.sdk.cluster],
    )
  }

  getPost(postAccount: anchor.web3.PublicKey) {
    return this.sdk.program.account.post?.fetch(postAccount)
  }

  /**
   * Fetches the List of all the Post's created by a profile Pubkey
   *EW8yRoHiGdvzK8rjAtaTS5MgZyVRUbBR35eKFF9e4mu8
   * @remarks
   * This Function uses the indexed data and is more efficient in querying it
   *
   *
   * @param profile - ProfilePDA Pubkey
   *
   * @returns all the post's and its data created by this profile
   *
   * @beta
   */
  getPostsByProfile(profile: anchor.web3.PublicKey) {
    // TODO: Add order by and pagination
    const query = gql`
        query getAllPostsOfAProfile {
          wordcel_0_1_1_decoded_post( where: {
              profile: { _eq: "${profile}" }
            }
          ) {
            profile
            cl_pubkey
            metadatauri
          }
        }
      `
    return this.sdk.gqlClient.request(query)
  }
  /**
   * Data inside the Post PDA
   *
   * @remarks
   * This function gets the data present in the post PDA
   *
   *
   * @beta
   */
  // getPost(account: anchor.web3.PublicKey) {
  //   return this.sdk.program.account.post.fetch(account);
  // }
  /**
   * Creates a new post on-chain
   *
   * @remarks
   * This function is used to create a Post on-chain
   *
   *
   * @beta
   */
  async createPost(user: anchor.web3.PublicKey, profileAccount: anchor.web3.PublicKey, metadataUri: string) {
    const randomHash = randombytes(32)
    const [postAccount, _] = await this.postPDA(randomHash)
    return this.sdk.program.methods
      .createPost?.(metadataUri, randomHash)
      .accounts({
        post: postAccount,
        profile: profileAccount,
        authority: user,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  }
  /**
   * Updates the on-chain post
   *
   * @remarks
   * This function updates the post account on-chain with updated values
   *
   *
   * @beta
   */
  updatePost(
    user: anchor.web3.PublicKey,
    profileAccount: anchor.web3.PublicKey,
    postAccount: anchor.web3.PublicKey,
    metadataUri: string,
  ) {
    return this.sdk.program.methods
      .updatePost?.(metadataUri)
      .accounts({
        post: postAccount,
        profile: profileAccount,
        authority: user,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  }
}
