import { ethers } from 'hardhat';
import Logger, { LogLevel } from 'eleventh';

Logger.setLogLevel(LogLevel.debug);

const main = async () => {
  const maxFeePerGas = 200n * (10n ** 9n);
  const maxPriorityFeePerGas = 100n * (10n ** 9n);
  Logger.info('Deploying the AmanaToken contract', {
    maxFeePerGas: maxFeePerGas?.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas?.toString(),
  });
  const amanaToken = await ethers.deployContract('AmanaToken', [], {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  Logger.info('Submitting the AmanaContract deployment transaction', {
    hash: amanaToken.deploymentTransaction()?.hash,
  });
  Logger.info('Waiting for the AmanaToken contract to be deployed');
  await amanaToken.waitForDeployment();
  Logger.info('The AmanaToken contract has been deployed', {
    address: amanaToken.target.toString(),
  });
};

main().catch((error) => {
  Logger.fatal('Failed to deploy the AmanaToken contract');
  console.error(error);
});
