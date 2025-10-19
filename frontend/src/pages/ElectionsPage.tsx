import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Election {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  totalVotes: number;
  candidateCount: number;
}

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch('/api/elections');
      const data = await response.json();
      setElections(data.elections || []);
    } catch (error) {
      console.error('Error fetching elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      created: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      tallied: 'bg-blue-100 text-blue-800',
    };
    return styles[status as keyof typeof styles] || styles.created;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Active Elections</h1>

        {elections.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg">No elections available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <Link
                key={election.id}
                to={`/elections/${election.id}`}
                className="card hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{election.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      election.status
                    )}`}
                  >
                    {election.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{election.description}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(election.startTime), 'MMM dd, yyyy')} -{' '}
                      {format(new Date(election.endTime), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{election.candidateCount} Candidates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>{election.totalVotes} Votes Cast</span>
                  </div>
                </div>

                <button className="btn btn-primary w-full mt-4">View Details</button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
