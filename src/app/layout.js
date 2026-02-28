import '../styles/globals.css';
import { ThemeProvider } from '../lib/theme';

export const metadata = {
  metadataBase: new URL('https://auxiliar.io'),
  title: {
    default: 'Auxiliar.io',
    template: '%s | Auxiliar.io',
  },
  description: 'Professional websites, embarrassingly low prices because AI did it.',
  openGraph: {
    siteName: 'Auxiliar.io',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
};

// Inline script to set theme + lang before first paint
const initScript = `
(function() {
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  var m = location.pathname.match(/^\\/(en|fr|es)/);
  if (m) document.documentElement.lang = m[1];
})();
`;

export default function RootLayout({ children }) {
  return (
    <html data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
