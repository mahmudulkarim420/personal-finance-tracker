import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative bg-base-200 border border-base-300 rounded-[32px] p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary rounded-b-full opacity-50" />
            
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-base-100 rounded-2xl flex items-center justify-center shadow-inner border border-base-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-500/10" />
                <AlertCircle className="h-10 w-10 text-rose-500 relative z-10" />
              </div>
            </div>
            
            <h1 className="text-7xl font-black text-base-content mb-2 tracking-tighter">404</h1>
            <h2 className="text-xl font-black text-base-content/80 mb-4 tracking-tight uppercase">Void Detected</h2>
            
            <p className="text-sm font-black text-base-content/60 leading-relaxed mb-10">
              The sector you are attempting to access does not exist in our current manifestation. Please return to known coordinates.
            </p>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:opacity-90 text-primary-content font-black text-sm py-4 px-6 rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-primary/25"
            >
              <Home className="h-4 w-4" strokeWidth={2.5} />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
