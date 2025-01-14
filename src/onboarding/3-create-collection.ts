import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateCollectionParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'COLLECTION_CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('COLLECTION_PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating collection...', collectionContractAddress);

  /**
   * Edit your values here
   */
  const params: CreateCollectionParams = {
    name: 'MRTEST',
    description: 'MRTEST',
    contract_address: collectionContractAddress,
    owner_public_key: ownerPublicKey,
    icon_url: 'https://gateway.pinata.cloud/ipfs/QmTr7BBER3AbHYefr2NBnjLYBWDb8P6vwr5mgPPtZQck1L',
    metadata_api_url: 'https://gateway.pinata.cloud/ipfs/QmUuVXw8SBr3ZZJwgQw6wdFbw3NhgJMo9b3U6NRsUEXGo5',
    collection_image_url: 'https://gateway.pinata.cloud/ipfs/QmTr7BBER3AbHYefr2NBnjLYBWDb8P6vwr5mgPPtZQck1L',
    project_id: parseInt(projectId, 10),
  };

  let collection;
  try {
    collection = await user.createCollection(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Created collection');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
