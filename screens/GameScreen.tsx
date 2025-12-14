import React, { useState, useEffect } from 'react';
import { GameConfig, BoardState, Position, PlayerColor } from '../types';
import { isValidMove, isKingInCheck, hasValidMoves } from '../utils/chessRules';
import { getBotMove } from '../services/geminiService';
import { Piece as PieceComponent } from '../components/Piece';
import { ArrowLeft, RotateCcw, BrainCircuit } from 'lucide-react';

interface GameScreenProps {
  config: GameConfig;
  onBack: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ config, onBack }) => {
  const [board, setBoard] = useState<BoardState>(config.initialBoard);
  const [turn, setTurn] = useState<PlayerColor>('white');
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validDestinations, setValidDestinations] = useState<Position[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'checkmate' | 'draw'>('playing');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{from: Position, to: Position} | null>(null);

  // Bot Logic Effect
  useEffect(() => {
    if (config.mode === 'PvE' && turn === 'black' && gameState === 'playing') {
      const makeBotMove = async () => {
        setIsBotThinking(true);
        // Using local logic now, no API call
        const move = await getBotMove(board, 'black', config.difficulty);
        setIsBotThinking(false);

        if (move) {
          executeMove(move.from, move.to);
        }
      };
      // Small delay to make it feel like turn passing
      setTimeout(makeBotMove, 100);
    }
  }, [turn, gameState]);

  // Check Game Over status
  useEffect(() => {
    if (isKingInCheck(board, turn)) {
      if (!hasValidMoves(board, turn)) {
        setGameState('checkmate');
      }
    } else {
        if (!hasValidMoves(board, turn)) {
            setGameState('draw');
        }
    }
  }, [turn, board]);

  const calculateValidMoves = (pos: Position) => {
    const moves: Position[] = [];
    const size = board.length;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const dest = { row: r, col: c };
        if (isValidMove(board, pos, dest, turn)) {
             const nextBoard = board.map(row => [...row]);
             nextBoard[dest.row][dest.col] = nextBoard[pos.row][pos.col];
             nextBoard[pos.row][pos.col] = null;
             
             if (!isKingInCheck(nextBoard, turn)) {
                 moves.push(dest);
             }
        }
      }
    }
    return moves;
  };

  const handleSquareClick = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    if (config.mode === 'PvE' && turn === 'black') return; 

    const clickedPos = { row, col };
    const clickedPiece = board[row][col];

    if (clickedPiece && clickedPiece.color === turn) {
      if (selectedPos && selectedPos.row === row && selectedPos.col === col) {
        setSelectedPos(null);
        setValidDestinations([]);
      } else {
        setSelectedPos(clickedPos);
        setValidDestinations(calculateValidMoves(clickedPos));
      }
      return;
    }

    if (selectedPos) {
      const isDestValid = validDestinations.some(p => p.row === row && p.col === col);
      if (isDestValid) {
        executeMove(selectedPos, clickedPos);
      } else {
        setSelectedPos(null);
        setValidDestinations([]);
      }
    }
  };

  const executeMove = (from: Position, to: Position) => {
    const newBoard = board.map(r => [...r]);
    const piece = { ...newBoard[from.row][from.col]!, hasMoved: true };
    
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;

    // Auto-queen promotion
    const isPromotion = piece.type === 'pawn' && (
       (piece.color === 'white' && to.row === 0) || 
       (piece.color === 'black' && to.row === board.length - 1)
    );

    if (isPromotion) {
        newBoard[to.row][to.col] = { ...piece, type: 'queen' };
    }

    setBoard(newBoard);
    setTurn(turn === 'white' ? 'black' : 'white');
    setSelectedPos(null);
    setValidDestinations([]);
    setLastMove({from, to});
  };

  const getStatusText = () => {
    if (gameState === 'checkmate') return `پایان بازی! برنده: ${turn === 'white' ? 'سیاه' : 'سفید'}`;
    if (gameState === 'draw') return 'تساوی';
    if (isBotThinking) return 'هوش مصنوعی در حال فکر کردن...';
    return `نوبت حرکت: ${turn === 'white' ? 'سفید' : 'سیاه'}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-4 font-vazir" dir="rtl"
         style={{
             backgroundImage: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 100%)'
         }}>
      
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 bg-slate-900/50 backdrop-blur p-4 rounded-2xl border border-white/10 shadow-xl">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition border border-white/5">
            <ArrowLeft className="text-slate-300" />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                {getStatusText()}
            </h1>
            {isKingInCheck(board, turn) && gameState === 'playing' && (
                <span className="text-red-500 font-bold animate-pulse text-sm mt-1 drop-shadow-md">شاه در خطر است!</span>
            )}
        </div>
        <div className="w-10"></div>
      </div>

      {/* Board */}
      <div className="relative shadow-[0_0_60px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border-8 border-slate-800"
           style={{
               display: 'grid',
               gridTemplateColumns: `repeat(${config.boardSize}, minmax(0, 1fr))`,
               width: 'min(90vw, 600px)',
               aspectRatio: '1/1',
               background: '#1e293b'
           }}>
        {board.map((row, r) => (
            row.map((cell, c) => {
                const isBlack = (r + c) % 2 === 1;
                const isSelected = selectedPos?.row === r && selectedPos?.col === c;
                const isDest = validDestinations.some(p => p.row === r && p.col === c);
                const isLastMove = (lastMove?.from.row === r && lastMove?.from.col === c) || (lastMove?.to.row === r && lastMove?.to.col === c);

                return (
                    <div 
                        key={`${r}-${c}`}
                        onClick={() => handleSquareClick(r, c)}
                        className={`
                            relative flex items-center justify-center cursor-pointer transition-colors duration-150 aspect-square
                            ${isBlack ? 'bg-slate-700' : 'bg-slate-500'}
                            ${isSelected ? '!bg-amber-600 !shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]' : ''}
                            ${isLastMove && !isSelected ? '!bg-blue-500/40' : ''}
                        `}
                    >
                        {/* Valid Move Indicator */}
                        {isDest && (
                            <div className={`absolute w-4 h-4 rounded-full z-10 ${cell ? 'ring-4 ring-red-500/50 scale-150' : 'bg-green-500/50 shadow-[0_0_10px_#22c55e]'}`} />
                        )}
                        
                        {cell && (
                            <div className={`w-full h-full flex items-center justify-center ${isSelected ? 'scale-110 drop-shadow-2xl' : ''}`}>
                                <PieceComponent piece={cell} />
                            </div>
                        )}
                    </div>
                );
            })
        ))}
        
        {/* Thinking Overlay */}
        {isBotThinking && (
             <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-20">
                 <div className="bg-slate-900/90 p-4 rounded-2xl shadow-2xl border border-amber-500/30 animate-pulse flex flex-col items-center gap-2">
                     <BrainCircuit size={40} className="text-amber-500" />
                     <span className="text-amber-200 text-xs font-mono">CALCULATING...</span>
                 </div>
             </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameState !== 'playing' && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-slate-900 p-8 rounded-3xl text-center border-2 border-amber-500 max-w-sm w-full mx-4 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                  <h2 className="text-3xl font-bold text-amber-500 mb-2">بازی تمام شد</h2>
                  <p className="text-lg text-slate-300 mb-8">{getStatusText()}</p>
                  <button 
                    onClick={onBack}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                  >
                      <RotateCcw size={20} />
                      <span>بازی جدید</span>
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
