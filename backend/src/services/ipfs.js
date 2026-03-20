import { create, CID } from 'ipfs-http-client';

let ipfsClient = null;

function getIPFSClient() {
  if (!ipfsClient) {
    const projectId = process.env.PINATA_API_KEY;
    const projectSecret = process.env.PINATA_API_SECRET;
    
    if (projectId && projectSecret) {
      ipfsClient = create({
        host: 'ipfs.pinata.cloud',
        port: 443,
        protocol: 'https',
        headers: {
          pinata_api_key: projectId,
          pinata_secret_api_key: projectSecret
        }
      });
    } else {
      ipfsClient = create({
        host: 'ipfs.io',
        port: 443,
        protocol: 'https'
      });
    }
  }
  return ipfsClient;
}

export async function uploadToIPFS({ name, description, image, properties, assetType }) {
  const client = getIPFSClient();
  
  const metadata = {
    name,
    description: description || '',
    image: image || '',
    properties: {
      ...properties,
      assetType: assetType || 'other',
      createdAt: new Date().toISOString(),
      platform: 'RealFlow Studio'
    }
  };

  try {
    const { cid } = await client.add(JSON.stringify(metadata));
    
    return {
      cid: cid.toString(),
      url: `ipfs://${cid.toString()}`,
      gatewayUrl: `https://ipfs.io/ipfs/${cid.toString()}`
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

export async function getFromIPFS(cid) {
  const client = getIPFSClient();
  
  try {
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks).toString();
    return JSON.parse(data);
  } catch (error) {
    console.error('IPFS fetch error:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}

export async function pinMetadata(cid) {
  const projectId = process.env.PINATA_API_KEY;
  const projectSecret = process.env.PINATA_API_SECRET;
  
  if (!projectId || !projectSecret) {
    return { pinned: false, reason: 'Pinata API not configured' };
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': projectId,
        'pinata_secret_api_key': projectSecret
      },
      body: JSON.stringify({
        hashToPin: cid,
        pinataMetadata: {
          name: `RealFlow-Studio-${Date.now()}`
        }
      })
    });

    const data = await response.json();
    return { pinned: true, pinataResponse: data };
  } catch (error) {
    console.error('Pinata pin error:', error);
    return { pinned: false, reason: error.message };
  }
}
