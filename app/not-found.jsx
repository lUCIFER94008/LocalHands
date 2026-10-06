import React from 'react';
import Link from 'next/link';
import { Button } from '@/ui/Button';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-8">
        The page you are looking for might have been moved, removed, or does not exist on Local Hands.
      </p>
      <Link href="/">
        <Button variant="primary" className="gap-2">
          <Home className="w-4 h-4" />
          Back to Home Page
        </Button>
      </Link>
    </div>
  );
}
