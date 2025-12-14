import React, { useState, useEffect } from 'react';
import { GameConfig, BoardState, Piece, PieceType, PlayerColor, Position } from '../types';
import { createEmptyBoard, countPieces, isKingInCheck } from '../utils/chessRules';
import { Piece as PieceComponent } from '../components/Piece';
import { ArrowLeft, Check, RefreshCcw, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface EditorScreenProps {
  config: Partial<GameConfig>;
  onStartGame: (finalConfig: GameConfig) => void;
  onBack: () => void;
}

export const EditorScreen: React.FC<EditorScreenProps> = ({ config, onStartGame, onBack }) => {
  const [size, setSize] = useState<number>(8);
  const [board, setBoard] = useState<BoardState>(createEmptyBoard(8));
  const [error, setError] = useState<string | null>(null);

  // Initialize board if changing size
  useEffect(() => {
    setBoard(createEmptyBoard(size));
  }, [size]);

  // --- Drag and Drop Logic ---

  const handleDragStart = (e: React.DragEvent, type: PieceType, color: PlayerColor) => {
      e.dataTransfer.setData('pieceType', type);
      e.dataTransfer.setData('pieceColor', color);
      e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('pieceType') as PieceType;
      const color = e.dataTransfer.getData('pieceColor') as PlayerColor;

      if (!type || !color) return;

      const existing = board[row][col];
      if (existing?.type === 'king') {
          setError('نمی‌توانید جایگاه شاه را تغییر دهید!');
          setTimeout(() => setError(null), 2000);
          return;
      }

      const tempBoard = board.map(r => r.map(c => c ? {...c} : null));
      tempBoard[row][col] = { type, color };

      const opponentColor = color === 'white' ? 'black' : 'white';
      if (isKingInCheck(tempBoard, opponentColor)) {
           setError(`این مهره باعث کیش شدن شاه ${opponentColor === 'white' ? 'سفید' : 'سیاه'} می‌شود!`);
           setTimeout(() => setError(null), 3000);
           return;
      }

      setBoard(tempBoard);
      setError(null);
  };

  const handleSquareClick = (row: number, col: number) => {
      const piece = board[row][col];
      if (piece?.type === 'king') {
          setError('شاه قابل حذف نیست.');
          setTimeout(() => setError(null), 2000);
          return;
      }
      if (piece) {
          const newBoard = board.map(r => r.map(c => c ? {...c} : null));
          newBoard[row][col] = null;
          setBoard(newBoard);
      }
  };

  const validateAndStart = () => {
    if (isKingInCheck(board, 'black')) {
       setError('شاه سیاه نباید در وضعیت کیش باشد.');
       return;
    }
    
    if (config.mode && config.difficulty) {
        onStartGame({
            mode: config.mode,
            difficulty: config.difficulty,
            boardSize: size,
            initialBoard: board
        });
    }
  };

  const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight', 'pawn'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-vazir" dir="rtl"
         style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)'
         }}>
      
      {/* Header */}
      <header className="p-4 backdrop-blur-md bg-slate-900/50 border-b border-white/10 flex justify-between items-center shadow-lg z-10 sticky top-0">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all">
             <ArrowLeft size={24} className="text-amber-400" />
           </button>
           <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
             چیدمان استراتژیک
           </h2>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-xl border border-white/5">
             <span className="text-sm text-amber-200 hidden sm:inline px-2">سایز صفحه: {size}x{size}</span>
             <input 
                type="range" 
                min="5" 
                max="10" 
                value={size} 
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-32 accent-amber-500 cursor-pointer"
             />
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Board Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center justify-center relative">
             
             {error && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 backdrop-blur text-white px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center gap-3 animate-bounce">
                     <ShieldAlert size={24} />
                     <span className="font-bold">{error}</span>
                 </div>
             )}

             <div className="relative shadow-[0_0_50px_rgba(124,58,237,0.3)] rounded-xl overflow-hidden border-4 border-slate-700/50"
                  style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                      width: 'min(90vw, 600px)',
                      aspectRatio: '1/1',
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                  }}>
                {board.map((row, r) => (
                    row.map((cell, c) => {
                        const isBlack = (r + c) % 2 === 1;
                        const isLockedKing = cell?.type === 'king';
                        
                        return (
                            <div 
                                key={`${r}-${c}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, r, c)}
                                onClick={() => handleSquareClick(r, c)}
                                className={`
                                    flex items-center justify-center relative transition-all duration-300 aspect-square
                                    ${isBlack ? 'bg-slate-800/80' : 'bg-slate-600/80'}
                                    hover:bg-amber-500/20
                                `}
                            >
                                {cell && (
                                    <div className={`w-full h-full flex items-center justify-center ${isLockedKing ? "opacity-100 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" : "animate-in zoom-in duration-300"}`}>
                                        <PieceComponent piece={cell} />
                                    </div>
                                )}
                                {isLockedKing && (
                                    <div className="absolute inset-1 border-2 border-amber-500/30 rounded-full pointer-events-none" />
                                )}
                            </div>
                        );
                    })
                ))}
             </div>
             
             <div className="mt-6 flex gap-4">
                <button 
                    onClick={() => setBoard(createEmptyBoard(size))}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-white/5"
                >
                    <RefreshCcw size={18} />
                    <span>بازنشانی صفحه</span>
                </button>
             </div>
        </div>

        {/* Tools Sidebar */}
        <div className="w-full md:w-80 bg-slate-900/60 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto flex flex-col gap-8 shadow-2xl z-20">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm">
                    <Trash2 size={16} />
                    <span>راهنما</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                    برای چیدن مهره‌ها، آن‌ها را از لیست پایین بکشید و روی صفحه رها کنید. مهره‌ها به صورت خودکار تغییر سایز می‌دهند.
                </p>
            </div>

            <div>
                <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                    لشکر سفید
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {pieces.map(p => (
                        <div
                            key={`white-${p}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, p, 'white')}
                            className="aspect-square bg-slate-800/80 hover:bg-slate-700 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing border border-white/5 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all group p-2"
                        >
                            <PieceComponent piece={{ type: p, color: 'white' }} className="group-hover:scale-110" />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                    لشکر سیاه
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {pieces.map(p => (
                        <div
                            key={`black-${p}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, p, 'black')}
                            className="aspect-square bg-slate-800/80 hover:bg-slate-700 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing border border-white/5 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all group p-2"
                        >
                            <PieceComponent piece={{ type: p, color: 'black' }} className="group-hover:scale-110" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6">
                <button 
                    onClick={validateAndStart}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-transform active:scale-95 border border-white/10"
                >
                    <Check size={24} />
                    <span>شروع نبرد</span>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
