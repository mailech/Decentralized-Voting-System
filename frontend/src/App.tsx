import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VoterRegistrationPage from './pages/VoterRegistrationPage';
import ElectionsPageDemo from './pages/ElectionsPageDemo';
import VotingPageDemo from './pages/VotingPageDemo';
import ResultsPageDemo from './pages/ResultsPageDemo';
import AdminPanelDemo from './pages/AdminPanelDemo';
import NotFoundPage from './pages/NotFoundPage';
import DemoPage from './pages/DemoPage';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="demo" element={<DemoPage />} />
          <Route path="register" element={<VoterRegistrationPage />} />
          <Route path="elections" element={<ElectionsPageDemo />} />
          <Route path="election/:electionId" element={<ResultsPageDemo />} />
          <Route path="vote/:electionId" element={<VotingPageDemo />} />
          <Route path="results/:electionId" element={<ResultsPageDemo />} />
          <Route path="admin" element={<AdminPanelDemo />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
