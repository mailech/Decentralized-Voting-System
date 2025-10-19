import { useParams } from 'react-router-dom';

export default function ResultsPage() {
  const { electionId } = useParams();
  return <div className="min-h-screen p-8"><h1>Results for Election: {electionId}</h1></div>;
}
