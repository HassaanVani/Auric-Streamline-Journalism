import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Research } from './pages/Research';
import { Contacts } from './pages/Contacts';
import { ContactProfile } from './pages/ContactProfile';
import { EmailOutreach } from './pages/EmailOutreach';
import { Questions } from './pages/Questions';
import { Meetings } from './pages/Meetings';
import { Transcripts } from './pages/Transcripts';
import { ArticleDraft } from './pages/ArticleDraft';
import { EditorialReview } from './pages/EditorialReview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="research" element={<Research />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactProfile />} />
          <Route path="email" element={<EmailOutreach />} />
          <Route path="questions" element={<Questions />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="transcripts" element={<Transcripts />} />
          <Route path="drafts" element={<ArticleDraft />} />
          <Route path="review" element={<EditorialReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
