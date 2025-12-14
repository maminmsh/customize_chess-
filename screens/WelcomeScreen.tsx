import React, { useState } from 'react';
import { GameMode, Difficulty, GameConfig } from '../types';
import { Swords, Bot, Trophy, BrainCircuit } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: (mode: GameMode, difficulty: Difficulty) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const [mode, setMode] = useState<GameMode>('PvE');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const difficulties: { val: Difficulty; label: string; color: string }[] = [
    { val: 'Easy', label: 'آسان', color: 'bg-green-500' },
    { val: 'Medium', label: 'متوسط', color: 'bg-yellow-500' },
    { val: 'Hard', label: 'سخت', color: 'bg-orange-500' },
    { val: 'Very Hard', label: 'خیلی سخت', color: 'bg-red-600' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6" dir="rtl">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl font-bold text-center mb-2 text-amber-400">شطرنج سفارشی</h1>
        <p className="text-slate-400 text-center mb-8">تعمیم یافته و هوشمند با جمنای</p>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">انتخاب حریف</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('PvP')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  mode === 'PvP' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <Swords size={32} className="mb-2 text-amber-500" />
                <span>دو نفره</span>
              </button>
              <button
                onClick={() => setMode('PvE')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  mode === 'PvE' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <Bot size={32} className="mb-2 text-blue-500" />
                <span>بازی با ربات</span>
              </button>
            </div>
          </div>

          {/* Difficulty Selection (Only for PvE) */}
          <div className={`transition-all duration-300 ${mode === 'PvE' ? 'opacity-100 max-h-96' : 'opacity-50 grayscale pointer-events-none'}`}>
            <label className="block text-sm font-medium text-slate-300 mb-3">درجه سختی</label>
            <div className="grid grid-cols-2 gap-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.val}
                  onClick={() => setDifficulty(diff.val)}
                  className={`p-3 rounded-lg text-sm font-bold transition-transform active:scale-95 ${
                    difficulty === diff.val ? `${diff.color} text-white shadow-lg` : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNext(mode, difficulty)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>مرحله بعد: چیدمان</span>
            <Trophy size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
