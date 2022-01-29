export default function (network, contract_id = null) {
    let config;
    switch (network) {
    case 'production':
    case 'near':
    case 'mainnet':
        config = {
            networkId: 'mainnet',
            nodeUrl: 'https://rpc.mainnet.near.org',
            contractName: contract_id,
            walletUrl: 'https://wallet.near.org',
            helperUrl: 'https://helper.mainnet.near.org',
            helperAccount: 'near',
            explorerUrl: 'https://explorer.mainnet.near.org',
        };
        break;
    case 'development':
    case 'testnet':
        config = {
            networkId: 'testnet',
            nodeUrl: 'https://rpc.testnet.near.org',
            contractName: contract_id,
            walletUrl: 'https://wallet.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org',
            helperAccount: 'testnet',
            explorerUrl: 'https://explorer.testnet.near.org',
        };
        break;
    case 'betanet':
        config = {
            networkId: 'betanet',
            nodeUrl: 'https://rpc.betanet.near.org',
            contractName: contract_id,
            walletUrl: 'https://wallet.betanet.near.org',
            helperUrl: 'https://helper.betanet.near.org',
            helperAccount: 'betanet',
            explorerUrl: 'https://explorer.betanet.near.org',
        };
        break;
    case 'guildnet':
        config = {
            networkId: 'guildnet',
            nodeUrl: 'https://rpc.openshards.io',
            contractName: contract_id,
            walletUrl: 'https://wallet.openshards.io',
            helperUrl: 'https://helper.openshards.io',
            helperAccount: 'guildnet',
        };
        break;
    default:
        throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
    }

    // adding x-api-key for given RPC Server
    // config.headers = { 'x-api-key': getXApiKey(config.nodeUrl) };

    return config;
}

