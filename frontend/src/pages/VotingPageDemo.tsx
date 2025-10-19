import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Vote, CheckCircle, ArrowLeft } from 'lucide-react';
import { demoStore } from '../data/demoData';

export default function VotingPageDemo() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoWallet = localStorage.getItem('demoWallet');
  const election = demoStore.getElection(Number(electionId));

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Not Found</h2>
          <button
            onClick={() => navigate('/elections')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  if (!demoWallet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-6">Please connect your demo wallet to vote.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const hasVoted = demoStore.hasVoted(election.id, demoWallet);

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Voted!</h2>
          <p className="text-gray-600 mb-6">
            You have already cast your vote in this election.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/elections')}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Back to Elections
            </button>
            <button
              onClick={() => navigate(`/results/${election.id}`)}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (election.status !== 'active') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Election Not Active</h2>
          <p className="text-gray-600 mb-6">
            This election is currently {election.status}.
          </p>
          <button
            onClick={() => navigate('/elections')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate');
      return;
    }

    if (!demoWallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const success = demoStore.castVote(election.id, selectedCandidate, demoWallet);

      if (success) {
        toast.success('Vote cast successfully! 🎉');
        setTimeout(() => {
          navigate(`/results/${election.id}`);
        }, 1000);
      } else {
        toast.error('You have already voted in this election or the election is not active.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Voting error:', error);
      toast.error('Failed to cast vote. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/elections')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Elections
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Vote className="h-12 w-12 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{election.name}</h1>
              <p className="text-gray-600">{election.description}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Important:</strong> You can only vote once in this election. Your vote is
              final and cannot be changed.
            </p>
          </div>
        </div>

        {/* Candidates */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Candidate</h2>

          {election.candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => !isSubmitting && setSelectedCandidate(candidate.id)}
              className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all ${
                selectedCandidate === candidate.id
                  ? 'ring-4 ring-blue-500 border-2 border-blue-500'
                  : 'hover:shadow-lg border-2 border-transparent'
              }`}
            >
              <div className="flex items-start gap-6">
                {/* Radio Button */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedCandidate === candidate.id
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedCandidate === candidate.id && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Candidate Image */}
                <img
                  src={candidate.imageUrl}
                  alt={candidate.name}
                  className="w-24 h-24 rounded-full object-cover"
                />

                {/* Candidate Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{candidate.name}</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-2">{candidate.party}</p>
                  <p className="text-gray-600">{candidate.description}</p>
                </div>

                {/* Selected Badge */}
                {selectedCandidate === candidate.id && (
                  <CheckCircle className="h-8 w-8 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <button
            onClick={handleVote}
            disabled={!selectedCandidate || isSubmitting}
            className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 ${
              selectedCandidate && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Casting Vote...</span>
              </>
            ) : (
              <>
                <Vote className="h-6 w-6" />
                <span>Cast My Vote</span>
              </>
            )}
          </button>

          {selectedCandidate && (
            <p className="text-center text-sm text-gray-600 mt-4">
              You are voting for:{' '}
              <strong>
                {election.candidates.find((c) => c.id === selectedCandidate)?.name}
              </strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
