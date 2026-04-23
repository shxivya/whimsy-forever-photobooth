import './globals.css';
import { Playfair_Display, Parisienne, Inter, Cormorant_Garamond, Caveat } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const parisienne = Parisienne({ weight: '400', subsets: ['latin'], variable: '--font-parisienne', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cormorant = Cormorant_Garamond({ weight: ['400','500','600','700'], subsets: ['latin'], variable: '--font-cormorant', display: 'swap' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' });

export const metadata = {
  title: 'whimsy forever photobooth ✧ a dreamy photobooth',
  description: 'turn your memories into whimsy forever things — a vintage photobooth for girls who romanticize everything.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'whimsy forever photobooth ✧ a dreamy photobooth',
    description: 'a vintage digital photobooth for keeping your softest memories.',
    url: 'https://tinyforeverthings.com',
    siteName: 'whimsy forever photobooth',
    images: [
      {
        url: 'https://tinyforeverthings.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'whimsy forever photobooth ✧ a dreamy photobooth',
    description: 'turn your memories into whimsy forever things.',
    images: ['https://tinyforeverthings.com/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${parisienne.variable} ${inter.variable} ${cormorant.variable} ${caveat.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
