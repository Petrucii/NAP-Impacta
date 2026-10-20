import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipLink } from './SkipLink';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
