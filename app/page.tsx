import ChatInterface from '@/components/ChatInterface';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl mb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-sm font-sans font-medium mb-4">
          <Sparkles size={14} />
          <span>Intelligent Learning</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#1a1a1a]">
          Learn with <span className="italic text-[#5A5A40]">Astra</span>
        </h1>
        <p className="text-xl text-[#1a1a1a]/60 max-w-xl mx-auto">
          Your calm, intelligent companion for mastering complex concepts through clarity and structure.
        </p>
      </div>

      <ChatInterface />

      <footer className="mt-12 text-[#5A5A40]/40 text-sm font-sans">
        &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Astra AI Tutor. All rights reserved.
      </footer>
    </main>
  );
}
