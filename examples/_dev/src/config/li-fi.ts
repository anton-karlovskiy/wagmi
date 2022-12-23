// RE: https://docs.li.fi/list-chains-bridges-dexs#chains
const FROM_CHAIN = 'AVA';
const TO_CHAIN = 'ETH';
const FROM_TOKEN = 'USDC';
const TO_TOKEN = 'USDC';
const FROM_AMOUNT = '10000'; // 0.01 USDC

const LIFI_QUOTE_API_ENDPOINT = 'https://li.quest/v1/quote';

const LIFI_STATUS_API_ENDPOINT = 'https://li.quest/v1/status';

// const BLOCK_EXPLORER_TX_HASH_URL = 'https://blockscout.com/xdai/mainnet/tx'; // Gnosis
// const BLOCK_EXPLORER_TX_HASH_URL = 'https://etherscan.io/tx'; // Ethereum
const BLOCK_EXPLORER_TX_HASH_URL = 'https://snowtrace.io/tx'; // Avalanche C-Chain

export {
  FROM_CHAIN,
  FROM_TOKEN,
  TO_CHAIN,
  TO_TOKEN,
  FROM_AMOUNT,
  LIFI_QUOTE_API_ENDPOINT,
  LIFI_STATUS_API_ENDPOINT,
  BLOCK_EXPLORER_TX_HASH_URL
};
