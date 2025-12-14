import { BoardState, Difficulty, Move, PlayerColor } from "../types";
import { getAllValidMoves, evaluateBoard, isKingInCheck } from "../utils/chessRules";

// Simple Minimax with Alpha-Beta Pruning
const minimax = (
    board: BoardState,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    turn: PlayerColor
): number => {
    if (depth === 0) {
        return evaluateBoard(board);
    }

    const validMoves = getAllValidMoves(board, turn);
    
    // Checkmate or Stalemate check
    if (validMoves.length === 0) {
        if (isKingInCheck(board, turn)) {
            return isMaximizing ? -10000 : 10000; // Checkmate
        }
        return 0; // Stalemate
    }

    if (isMaximizing) { // White
        let maxEval = -Infinity;
        for (const move of validMoves) {
            const newBoard = board.map(row => row.map(cell => cell ? {...cell} : null));
            newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
            newBoard[move.from.row][move.from.col] = null;

            const evalScore = minimax(newBoard, depth - 1, false, alpha, beta, 'black');
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else { // Black
        let minEval = Infinity;
        for (const move of validMoves) {
            const newBoard = board.map(row => row.map(cell => cell ? {...cell} : null));
            newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
            newBoard[move.from.row][move.from.col] = null;

            const evalScore = minimax(newBoard, depth - 1, true, alpha, beta, 'white');
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

export const getBotMove = async (
  board: BoardState,
  turn: PlayerColor,
  difficulty: Difficulty
): Promise<Move | null> => {
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 500));

    const allMoves = getAllValidMoves(board, turn);
    if (allMoves.length === 0) return null;

    // Easy: Completely Random
    if (difficulty === 'Easy') {
        const randomIndex = Math.floor(Math.random() * allMoves.length);
        return allMoves[randomIndex];
    }

    // Medium: Random but takes pieces if available
    if (difficulty === 'Medium') {
         // Try to find a capture
         const captures = allMoves.filter(m => board[m.to.row][m.to.col] !== null);
         if (captures.length > 0 && Math.random() > 0.3) {
             return captures[Math.floor(Math.random() * captures.length)];
         }
         return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    // Hard/Very Hard: Minimax
    const depth = difficulty === 'Hard' ? 2 : 3;
    let bestMove: Move | null = null;
    let bestValue = turn === 'white' ? -Infinity : Infinity;
    
    // Shuffle moves to add variety in equal positions
    const shuffledMoves = allMoves.sort(() => Math.random() - 0.5);

    for (const move of shuffledMoves) {
        const newBoard = board.map(row => row.map(cell => cell ? {...cell} : null));
        newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
        newBoard[move.from.row][move.from.col] = null;

        const boardValue = minimax(
            newBoard, 
            depth - 1, 
            turn === 'black', // If I am White, next is Black (minimizing)
            -Infinity, 
            Infinity, 
            turn === 'white' ? 'black' : 'white'
        );

        if (turn === 'white') {
            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        } else {
            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }
    }

    return bestMove || allMoves[0];
};
