import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import { trackView } from '@/features/analytics/api';

import Home from '@/pages/Home';
import Sobre from '@/pages/Sobre';
import Equipe from '@/pages/Equipe';
import Servicos from '@/pages/Servicos';
import ServicoDetalhe from '@/pages/ServicoDetalhe';
import Conteudos from '@/pages/Conteudos';
import ConteudoDetalhe from '@/pages/ConteudoDetalhe';
import Contato from '@/pages/Contato';
import Faq from '@/pages/Faq';
import Feedback from '@/pages/Feedback';
import Acessibilidade from '@/pages/Acessibilidade';
import NotFound from '@/pages/NotFound';

import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminServices from '@/pages/admin/ServicesAdmin';
import AdminPosts from '@/pages/admin/PostsAdmin';
import AdminMessages from '@/pages/admin/MessagesAdmin';

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    // scroll para o topo + track
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    void trackView(location.pathname);
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <RouteTracker />
      <Routes>
        {/* público */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/servicos/:slug" element={<ServicoDetalhe />} />
          <Route path="/conteudos" element={<Conteudos />} />
          <Route path="/conteudos/:slug" element={<ConteudoDetalhe />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/acessibilidade" element={<Acessibilidade />} />
        </Route>

        {/* admin login (sem guard) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* admin protegido */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/servicos" element={<AdminServices />} />
          <Route path="/admin/conteudos" element={<AdminPosts />} />
          <Route path="/admin/mensagens" element={<AdminMessages />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
