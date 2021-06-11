import ipfs from 'ipfs-http-client';

const ipfsInstance = new ipfs.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default ipfsInstance;