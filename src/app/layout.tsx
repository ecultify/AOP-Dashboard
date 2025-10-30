import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/auth-context';
import { ClientWrapper } from '@/components/client-wrapper';
import { DataProvider } from '@/contexts/DataContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "SOA Analytics Dashboard",
  description: "Service-Oriented Architecture Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>
          <AuthProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </AuthProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
