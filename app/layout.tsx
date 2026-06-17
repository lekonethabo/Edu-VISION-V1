import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Edu-VISION - Vital Information System for Institutional & Operational Needs',
  description: 'Botswana Education Statistics & Analytics System (Edu-VISION)',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased text-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-slate-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
