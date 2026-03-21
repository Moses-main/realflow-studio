import { create, CID } from 'ipfs-http-client';

let ipfsClient = null;
let clientCreationFailed = false;
const MAX_RETRIES = 3;

// Configurable IPFS gateway
const IPFS_GATEWAY = process.env.IPFS_GATEWAY || 'ipfs.io';
const IPFS_API_HOST = process.env.IPFS_API_HOST || 'ipfs.io';

function getIPFSClient() {
  if (clientCreationFailed) {
    throw new Error('IPFS client unavailable - previous creation failed');
  }
  
  if (!ipfsClient) {
    const projectId = process.env.PINATA_API_KEY;
    const projectSecret = process.env.PINATA_API_SECRET;
    
    try {
      if (projectId && projectSecret) {
        ipfsClient = create({
          host: process.env.IPFS_API_HOST || 'ipfs.pinata.cloud',
          port: 443,
          protocol: 'https',
          headers: {
            pinata_api_key: projectId,
            pinata_secret_api_key: projectSecret
          }
        });
      } else {
        ipfsClient = create({
          host: IPFS_API_HOST,
          port: 443,
          protocol: 'https'
        });
      }
      clientCreationFailed = false;
    } catch (error) {
      clientCreationFailed = true;
      throw error;
    }
  }
  return ipfsClient;
}

function resetIPFSClient() {
  ipfsClient = null;
  clientCreationFailed = false;
}

export async function uploadToIPFS({ name, description, image, properties, assetType }, timeoutMs = 60000) {
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

  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('IPFS upload request timed out'));
    }, timeoutMs);

    try {
      const { cid } = await client.add(JSON.stringify(metadata));
      clearTimeout(timeoutId);
      resolve({
        cid: cid.toString(),
        url: `ipfs://${cid.toString()}`,
        gatewayUrl: `https://${IPFS_GATEWAY}/ipfs/${cid.toString()}`
      });
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('IPFS upload error:', error);
      if (error.message?.includes('timed out') || error.name === 'TimeoutError') {
        reject(new Error('IPFS upload request timed out'));
      } else {
        reject(new Error(`Failed to upload to IPFS: ${error.message}`));
      }
    }
  });
}

export async function getFromIPFS(cid, timeoutMs = 30000) {
  const client = getIPFSClient();
  
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('IPFS fetch request timed out'));
    }, timeoutMs);

    try {
      const chunks = [];
      for await (const chunk of client.cat(cid)) {
        chunks.push(chunk);
      }
      clearTimeout(timeoutId);
      const data = Buffer.concat(chunks).toString();
      resolve(JSON.parse(data));
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('IPFS fetch error:', error);
      if (error.message?.includes('timed out') || error.name === 'TimeoutError') {
        reject(new Error('IPFS fetch request timed out'));
      } else {
        reject(new Error(`Failed to fetch from IPFS: ${error.message}`));
      }
    }
  });
}

export async function pinMetadata(cid) {
  const projectId = process.env.PINATA_API_KEY;
  const projectSecret = process.env.PINATA_API_SECRET;
  
  if (!projectId || !projectSecret) {
    return { pinned: false, reason: 'Pinata API not configured' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Pinata API error: ${response.status} ${response.statusText}${errorData.message ? ` - ${errorData.message}` : ''}`);
    }

    const data = await response.json();
    return { pinned: true, pinataResponse: data };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { pinned: false, reason: 'Pin request timed out' };
    }
    console.error('Pinata pin error:', error);
    return { pinned: false, reason: error.message };
  }
}
