import './globals.css';
import { ToastProvider } from '@/ui/Toast';

export const metadata = {
  title: 'Local Hands | Your Local Service Partner',
  description: 'Find trusted local professionals for your home services. Verified experts, transparent pricing, and hassle-free booking.',
  keywords: 'local services, electrician, plumber, carpenter, painter, AC repair, cleaning, home services, India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased flex flex-col selection:bg-blue-600 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
