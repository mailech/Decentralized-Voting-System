export const CONTRACTS = {
  VoterRegistry: {
    address: (import.meta.env.VITE_VOTER_REGISTRY_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`,
  },
  ElectionManager: {
    address: (import.meta.env.VITE_ELECTION_MANAGER_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512') as `0x${string}`,
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
