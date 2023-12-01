import { SEED_PREFIXES, WORDCEL_INVITE_PROGRAMS, WORDCEL_PROGRAMS } from './constants';
import { SDK } from './sdk';
import { web3 } from '@coral-xyz/anchor';
import { gql } from 'graphql-request';
import randombytes from 'randombytes';

/**
 * This Class contains all the Function's that includes interaction with Profile Account on-chain
 *
 *
 * @beta
 */
export class Profile {
  readonly sdk: SDK;

  constructor(sdk: SDK) {
    this.sdk = sdk;
  }
  /**
   * Returns the Profile PDA
   *
   * @remarks
   * This function takes in the randomHash and returns a PDA
   *
   *
   * @beta
   */
  profilePDA(randomHash: Buffer) {
    return web3.PublicKey.findProgramAddressSync(
      [SEED_PREFIXES['profile'], randomHash],
      // @ts-ignore
      WORDCEL_PROGRAMS[this.sdk.cluster],
    );
  }

  /**
   * Return's the Data for all the profile accounts created by a user Pubkey
   *
   * @remarks
   * This function does a GraphQL Query and is much faster and efficient in fetching data
   *
   *@param user - Pubkey of the creator of the profile account
   *
   * @beta
   */
  getProfilesByUserGQL(user: web3.PublicKey) {
    const query = gql`
        query getProfileByUser {
          wordcel_0_1_1_decoded_profile( where: {
              authority: { _eq: "${user}" }
            }
          ) {
            cl_pubkey
          }
        }
      `;
    return this.sdk.gqlClient.request(query);
  }
  /**
   * Returns the Profile Account for a Pubkey
   *
   *
   *
   *@param account - Pubkey of the creator of the profile account
   *
   * @beta
   */
  getProfileByUserRPC(account: web3.PublicKey) {
    return this.sdk.program.account.profile?.all([
      {
        memcmp: {
          offset: 8,
          bytes: account.toBase58(),
        },
      },
    ]);
  }

  /**
   * Fetches the List of all the Profile's created by a user Pubkey
   *EW8yRoHiGdvzK8rjAtaTS5MgZyVRUbBR35eKFF9e4mu8
   * @remarks
   * This Function uses the indexed data and is more efficient in querying it
   *
   *
   * @param profile - User Pubkey
   *
   * @returns all the Profiles created by a User
   *
   * @beta
   */
  getProfilesByUser(user: web3.PublicKey) {
    const query = gql`
        query getProfileByUser {
          wordcel_0_1_1_decoded_profile( where: {
              authority: { _eq: "${user}" }
            }
          ) {
            cl_pubkey
          }
        }
      `;
    return this.sdk.gqlClient.request(query);
  }

  /**
   * This Function return's the data for a profile account PDA
   *
   * @remarks
   * This fetches the data of the profile account
   *
   * @param account - Profile PDA Pubkey
   *
   * @beta
   */
  getProfile(account: web3.PublicKey) {
    return this.sdk.program.account.profile?.fetch(account);
  }

  /**
   * Return's the Instruction for creating a profile
   *
   * @remarks
   * This is used to create a profile
   *
   * @param user - The Publickey for which the profile account is getting created
   * @param inviteAccount  - The Publickey that invited to create the account
   * @returns A Instruction
   *
   *
   * @beta
   */
  async createProfile(user: web3.PublicKey, inviteAccount: web3.PublicKey) {
    const randomHash = randombytes(32);
    const [profileAccount, _] = await this.profilePDA(randomHash);
    return this.sdk.program.methods
      .initialize?.(randomHash)
      .accounts({
        profile: profileAccount,
        user: user,
        invitation: inviteAccount,
        // @ts-ignore
        invitationProgram: WORDCEL_INVITE_PROGRAMS[this.sdk.cluster],
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction();
  }
}
