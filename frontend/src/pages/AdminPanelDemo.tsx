import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Users, Calendar } from 'lucide-react';
import { demoStore, Election, Candidate } from '../data/demoData';

export default function AdminPanelDemo() {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingElection, setEditingElection] = useState<number | null>(null);

  // Form state
  const [electionName, setElectionName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'active' | 'closed'>('upcoming');
  const [candidates, setCandidates] = useState<Omit<Candidate, 'id' | 'votes'>[]>([
    { name: '', party: '', description: '', imageUrl: '' },
  ]);

  const elections = demoStore.getElections();

  const resetForm = () => {
    setElectionName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStatus('upcoming');
    setCandidates([{ name: '', party: '', description: '', imageUrl: '' }]);
    setShowCreateForm(false);
    setEditingElection(null);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', party: '', description: '', imageUrl: '' }]);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length > 1) {
      setCandidates(candidates.filter((_, i) => i !== index));
    }
  };

  const updateCandidate = (index: number, field: string, value: string) => {
    const updated = [...candidates];
    updated[index] = { ...updated[index], [field]: value };
    setCandidates(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!electionName || !description || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (candidates.some(c => !c.name || !c.party)) {
      toast.error('Please fill in all candidate names and parties');
      return;
    }

    const newElection: Election = {
      id: Date.now(),
      name: electionName,
      description,
      startDate,
      endDate,
      status,
      totalVotes: 0,
      candidates: candidates.map((c, idx) => ({
        ...c,
        id: Date.now() + idx,
        votes: 0,
        imageUrl: c.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&size=200`,
      })),
    };

    demoStore.addElection(newElection);
    toast.success('Election created successfully!');
    resetForm();
  };

  const deleteElection = (id: number) => {
    if (confirm('Are you sure you want to delete this election?')) {
      demoStore.deleteElection(id);
      toast.success('Election deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Create and manage elections</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold"
          >
            <Plus className="h-5 w-5" />
            Create New Election
          </button>
        </div>

        {/* Create Election Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Election</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Election Name *
                  </label>
                  <input
                    type="text"
                    value={electionName}
                    onChange={(e) => setElectionName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Student Council Election 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the purpose of this election..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Candidates */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
                  <button
                    type="button"
                    onClick={addCandidate}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Candidate
                  </button>
                </div>

                <div className="space-y-4">
                  {candidates.map((candidate, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-700">Candidate {index + 1}</h4>
                        {candidates.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCandidate(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={candidate.name}
                          onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                          placeholder="Candidate Name *"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={candidate.party}
                          onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                          placeholder="Party/Affiliation *"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={candidate.description}
                          onChange={(e) => updateCandidate(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Create Election
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Elections */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Existing Elections</h2>

          {elections.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No elections created yet. Create your first election!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {elections.map((election) => (
                <div
                  key={election.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{election.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            election.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : election.status === 'upcoming'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{election.description}</p>
                      <div className="flex gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{election.candidates.length} candidates</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{election.totalVotes} votes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/results/${election.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteElection(election.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
