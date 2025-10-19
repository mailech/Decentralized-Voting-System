// Demo data for the voting system
export interface Candidate {
  id: number;
  name: string;
  party: string;
  description: string;
  imageUrl: string;
  votes: number;
}

export interface Election {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'closed';
  totalVotes: number;
  candidates: Candidate[];
}

export const demoElections: Election[] = [
  {
    id: 1,
    name: 'Student Council President 2025',
    description: 'Vote for your next student council president who will represent all students.',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: 'active',
    totalVotes: 247,
    candidates: [
      {
        id: 1,
        name: 'Alice Johnson',
        party: 'Progressive Students',
        description: 'Focused on improving campus facilities and student welfare programs.',
        imageUrl: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=0D8ABC&color=fff&size=200',
        votes: 98,
      },
      {
        id: 2,
        name: 'Bob Smith',
        party: 'Student Unity',
        description: 'Committed to enhancing academic resources and mental health support.',
        imageUrl: 'https://ui-avatars.com/api/?name=Bob+Smith&background=6366F1&color=fff&size=200',
        votes: 87,
      },
      {
        id: 3,
        name: 'Carol Williams',
        party: 'Independent',
        description: 'Advocating for sustainability initiatives and green campus programs.',
        imageUrl: 'https://ui-avatars.com/api/?name=Carol+Williams&background=10B981&color=fff&size=200',
        votes: 62,
      },
    ],
  },
  {
    id: 2,
    name: 'Community Board Election',
    description: 'Select your community board representatives for the next term.',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    status: 'active',
    totalVotes: 156,
    candidates: [
      {
        id: 4,
        name: 'David Brown',
        party: 'Community First',
        description: 'Experience in local governance and community development projects.',
        imageUrl: 'https://ui-avatars.com/api/?name=David+Brown&background=F59E0B&color=fff&size=200',
        votes: 67,
      },
      {
        id: 5,
        name: 'Emma Davis',
        party: 'Progressive Alliance',
        description: 'Focus on affordable housing and public transportation improvements.',
        imageUrl: 'https://ui-avatars.com/api/?name=Emma+Davis&background=EC4899&color=fff&size=200',
        votes: 54,
      },
      {
        id: 6,
        name: 'Frank Miller',
        party: 'Independent',
        description: 'Small business owner committed to economic growth and job creation.',
        imageUrl: 'https://ui-avatars.com/api/?name=Frank+Miller&background=8B5CF6&color=fff&size=200',
        votes: 35,
      },
    ],
  },
  {
    id: 3,
    name: 'Tech Club President Election',
    description: 'Choose the leader who will guide our tech club into the future.',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: 'upcoming',
    totalVotes: 0,
    candidates: [
      {
        id: 7,
        name: 'Grace Lee',
        party: 'Innovation Team',
        description: 'AI/ML enthusiast with plans for hackathons and tech workshops.',
        imageUrl: 'https://ui-avatars.com/api/?name=Grace+Lee&background=EF4444&color=fff&size=200',
        votes: 0,
      },
      {
        id: 8,
        name: 'Henry Wilson',
        party: 'Code Collective',
        description: 'Full-stack developer focused on collaborative coding projects.',
        imageUrl: 'https://ui-avatars.com/api/?name=Henry+Wilson&background=14B8A6&color=fff&size=200',
        votes: 0,
      },
    ],
  },
  {
    id: 4,
    name: 'Sports Committee Election',
    description: 'Vote for the sports committee members who will organize athletic events.',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    status: 'closed',
    totalVotes: 312,
    candidates: [
      {
        id: 9,
        name: 'Ivy Martinez',
        party: 'Athletics United',
        description: 'Former athlete with vision for inclusive sports programs.',
        imageUrl: 'https://ui-avatars.com/api/?name=Ivy+Martinez&background=F97316&color=fff&size=200',
        votes: 178,
      },
      {
        id: 10,
        name: 'Jack Thompson',
        party: 'Sports for All',
        description: 'Promoting fitness and wellness activities for everyone.',
        imageUrl: 'https://ui-avatars.com/api/?name=Jack+Thompson&background=3B82F6&color=fff&size=200',
        votes: 134,
      },
    ],
  },
];

// Demo voters
export interface Voter {
  id: string;
  walletAddress: string;
  email: string;
  isVerified: boolean;
  votedElections: number[];
}

export const demoVoters: Voter[] = [
  {
    id: '1',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    email: 'demo@example.com',
    isVerified: true,
    votedElections: [4],
  },
];

// Store for managing demo state
class DemoStore {
  private elections: Election[] = JSON.parse(JSON.stringify(demoElections));
  private voters: Voter[] = JSON.parse(JSON.stringify(demoVoters));
  private currentVoter: Voter | null = null;

  constructor() {
    // Load from localStorage if available
    const stored = localStorage.getItem('demoVotingData');
    if (stored) {
      const data = JSON.parse(stored);
      this.elections = data.elections || this.elections;
      this.voters = data.voters || this.voters;
    }
  }

  private save() {
    localStorage.setItem('demoVotingData', JSON.stringify({
      elections: this.elections,
      voters: this.voters,
    }));
  }

  getElections() {
    return this.elections;
  }

  getElection(id: number) {
    return this.elections.find(e => e.id === id);
  }

  registerVoter(walletAddress: string, email: string): Voter {
    const existing = this.voters.find(v => v.walletAddress === walletAddress);
    if (existing) {
      this.currentVoter = existing;
      return existing;
    }

    const newVoter: Voter = {
      id: Date.now().toString(),
      walletAddress,
      email,
      isVerified: true, // Auto-verify in demo
      votedElections: [],
    };

    this.voters.push(newVoter);
    this.currentVoter = newVoter;
    this.save();
    return newVoter;
  }

  getCurrentVoter(walletAddress: string): Voter | null {
    return this.voters.find(v => v.walletAddress === walletAddress) || null;
  }

  castVote(electionId: number, candidateId: number, walletAddress: string): boolean {
    const election = this.elections.find(e => e.id === electionId);
    const voter = this.voters.find(v => v.walletAddress === walletAddress);

    if (!election || !voter) return false;
    if (election.status !== 'active') return false;
    if (voter.votedElections.includes(electionId)) return false;

    const candidate = election.candidates.find(c => c.id === candidateId);
    if (!candidate) return false;

    candidate.votes++;
    election.totalVotes++;
    voter.votedElections.push(electionId);

    this.save();
    return true;
  }

  hasVoted(electionId: number, walletAddress: string): boolean {
    const voter = this.voters.find(v => v.walletAddress === walletAddress);
    return voter ? voter.votedElections.includes(electionId) : false;
  }

  addElection(election: Election) {
    this.elections.push(election);
    this.save();
  }

  deleteElection(id: number) {
    this.elections = this.elections.filter(e => e.id !== id);
    this.save();
  }

  updateElectionStatus(id: number, status: 'upcoming' | 'active' | 'closed') {
    const election = this.elections.find(e => e.id === id);
    if (election) {
      election.status = status;
      this.save();
    }
  }

  reset() {
    this.elections = JSON.parse(JSON.stringify(demoElections));
    this.voters = JSON.parse(JSON.stringify(demoVoters));
    this.save();
  }
}

export const demoStore = new DemoStore();
