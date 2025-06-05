import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './components/AuthLayout/AuthLayout';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "SafeFlood",
  description: "Sistema de gestão de riscos e monitoramento de enchentes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          <AuthLayout>
            {children}
          </AuthLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
