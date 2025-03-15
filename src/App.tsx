// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import QuestionList from './pages/QuestionList/QuestionList';
import EditQuestion from './pages/EditQuestion/EditQuestion';
import Layout from './components/Layout/Layout';
import ExtensionConfig from './pages/ExtensionConfig/ExtensionConfig';
import RewardSettingsPage from './pages/RewardSettingsPage/RewardSettings';

function App() {
  const adminToken = localStorage.getItem('adminToken');

  return (
    <Layout>
      <Routes>
        { !adminToken ? (
          <Route path="*" element={<AdminLogin />} />
        ) : (
          <>
            <Route path="/" element={<QuestionList />} />
            <Route path="/new" element={<EditQuestion />} />
            <Route path="/config" element={<ExtensionConfig />} />
            <Route path="/edit/:id" element={<EditQuestion />} />
            <Route path="/reward" element={<RewardSettingsPage/>} />
          </>
        )} 

      </Routes>
    </Layout>
  );
}

export default App;
