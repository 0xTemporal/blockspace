export const mintCompressedNft = async ({ apiUrl, params }: { apiUrl: string; params: any }) => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'helius-test',
      method: 'mintCompressedNft',
      params: {
        name: 'Exodia the Forbidden One',
        symbol: 'ETFO',
        owner: 'DCQnfUH6mHA333mzkU22b4hMvyqcejUBociodq8bB5HF',
        description:
          'Exodia the Forbidden One is a powerful, legendary creature composed of five parts: ' +
          'the Right Leg, Left Leg, Right Arm, Left Arm, and the Head. When all five parts are assembled, Exodia becomes an unstoppable force.',
        attributes: [
          {
            trait_type: 'Type',
            value: 'Legendary',
          },
          {
            trait_type: 'Power',
            value: 'Infinite',
          },
          {
            trait_type: 'Element',
            value: 'Dark',
          },
          {
            trait_type: 'Rarity',
            value: 'Mythical',
          },
        ],
        imageUrl:
          'https://cdna.artstation.com/p/assets/images/images/052/118/830/large/julie-almoneda-03.jpg?1658992401',
        externalUrl: 'https://www.yugioh-card.com/en/',
        sellerFeeBasisPoints: 6900,
        ...params,
      },
    }),
  })
  return await response.json()
}
