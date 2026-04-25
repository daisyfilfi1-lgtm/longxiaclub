import Navbar from '@/components/Navbar';
import Leaderboard from '@/components/Leaderboard';
import SceneTags from '@/components/SceneTags';
import EvolutionLog from '@/components/EvolutionLog';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dot-pattern">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-mint pointer-events-none" />
      
      <Navbar />
      
      <div className="relative pt-24">
        {/* Leaderboards - Main Visual */}
        <Leaderboard />
        
        {/* Scene Tags */}
        <SceneTags />

        {/* Evolution Log - Self-improvement transparency */}
        <EvolutionLog />
        
        {/* Footer */}
        <footer className="border-t border-slate-200 py-12 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">AI导航站</span>
              </div>
              <p className="text-slate-400 text-sm">
                © 2026 AI导航站. 连接前沿AI技术与大众用户
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
