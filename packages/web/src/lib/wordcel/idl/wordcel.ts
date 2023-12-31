export type Wordcel = {
  version: '0.1.1'
  name: 'wordcel'
  instructions: [
    {
      name: 'initialize'
      accounts: [
        {
          name: 'profile'
          isMut: true
          isSigner: false
        },
        {
          name: 'invitation'
          isMut: false
          isSigner: false
        },
        {
          name: 'user'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'invitationProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'randomHash'
          type: {
            array: ['u8', 32]
          }
        },
      ]
    },
    {
      name: 'createPost'
      accounts: [
        {
          name: 'profile'
          isMut: false
          isSigner: false
        },
        {
          name: 'post'
          isMut: true
          isSigner: false
        },
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'metadataUri'
          type: 'string'
        },
        {
          name: 'randomHash'
          type: {
            array: ['u8', 32]
          }
        },
      ]
    },
    {
      name: 'updatePost'
      accounts: [
        {
          name: 'profile'
          isMut: false
          isSigner: false
        },
        {
          name: 'post'
          isMut: true
          isSigner: false
        },
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'metadataUri'
          type: 'string'
        },
      ]
    },
    {
      name: 'comment'
      accounts: [
        {
          name: 'profile'
          isMut: false
          isSigner: false
        },
        {
          name: 'post'
          isMut: true
          isSigner: false
        },
        {
          name: 'replyTo'
          isMut: false
          isSigner: false
        },
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'metadataUri'
          type: 'string'
        },
        {
          name: 'randomHash'
          type: {
            array: ['u8', 32]
          }
        },
      ]
    },
    {
      name: 'initializeConnection'
      accounts: [
        {
          name: 'connection'
          isMut: true
          isSigner: false
        },
        {
          name: 'profile'
          isMut: false
          isSigner: false
        },
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: []
    },
    {
      name: 'closeConnection'
      accounts: [
        {
          name: 'connection'
          isMut: true
          isSigner: false
        },
        {
          name: 'profile'
          isMut: false
          isSigner: false
        },
        {
          name: 'authority'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: []
    },
  ]
  accounts: [
    {
      name: 'profile'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'randomHash'
            type: {
              array: ['u8', 32]
            }
          },
        ]
      }
    },
    {
      name: 'post'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'profile'
            type: 'publicKey'
          },
          {
            name: 'metadataUri'
            type: 'string'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'randomHash'
            type: {
              array: ['u8', 32]
            }
          },
          {
            name: 'replyTo'
            type: {
              option: 'publicKey'
            }
          },
        ]
      }
    },
    {
      name: 'connection'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'profile'
            type: 'publicKey'
          },
          {
            name: 'authority'
            type: 'publicKey'
          },
          {
            name: 'bump'
            type: 'u8'
          },
        ]
      }
    },
  ]
  types: [
    {
      name: 'ConnectionError'
      type: {
        kind: 'enum'
        variants: [
          {
            name: 'SelfFollow'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'URITooLarge'
    },
  ]
}

export const IDL: Wordcel = {
  version: '0.1.1',
  name: 'wordcel',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'profile',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'invitation',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'invitationProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'randomHash',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
    {
      name: 'createPost',
      accounts: [
        {
          name: 'profile',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'post',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'metadataUri',
          type: 'string',
        },
        {
          name: 'randomHash',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
    {
      name: 'updatePost',
      accounts: [
        {
          name: 'profile',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'post',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'metadataUri',
          type: 'string',
        },
      ],
    },
    {
      name: 'comment',
      accounts: [
        {
          name: 'profile',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'post',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'replyTo',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'metadataUri',
          type: 'string',
        },
        {
          name: 'randomHash',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
    {
      name: 'initializeConnection',
      accounts: [
        {
          name: 'connection',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'profile',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'closeConnection',
      accounts: [
        {
          name: 'connection',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'profile',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'profile',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'randomHash',
            type: {
              array: ['u8', 32],
            },
          },
        ],
      },
    },
    {
      name: 'post',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'profile',
            type: 'publicKey',
          },
          {
            name: 'metadataUri',
            type: 'string',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'randomHash',
            type: {
              array: ['u8', 32],
            },
          },
          {
            name: 'replyTo',
            type: {
              option: 'publicKey',
            },
          },
        ],
      },
    },
    {
      name: 'connection',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'profile',
            type: 'publicKey',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'ConnectionError',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'SelfFollow',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'URITooLarge',
    },
  ],
}
