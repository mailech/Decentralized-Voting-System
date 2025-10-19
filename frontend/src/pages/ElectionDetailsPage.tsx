import { useParams } from 'react-router-dom';

export default function ElectionDetailsPage() {
  const { id } = useParams();
  return <div className="min-h-screen p-8"><h1>Election Details: {id}</h1></div>;
}
