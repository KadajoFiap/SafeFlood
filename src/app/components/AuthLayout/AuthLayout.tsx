'use client';

import { usePathname } from 'next/navigation';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/register', '/confirm-email'].includes(pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? "" : "flex-grow"}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
} 