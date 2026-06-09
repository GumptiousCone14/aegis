import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Aegis Security',
  description: 'AI‑driven endpoint defense platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
