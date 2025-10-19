import { useParams } from 'react-router-dom';

export default function VotingPage() {
  const { electionId } = useParams();
  return <div className="min-h-screen p-8"><h1>Vote in Election: {electionId}</h1></div>;
}
