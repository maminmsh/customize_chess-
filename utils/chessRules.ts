import { BoardState, Piece, Position, PlayerColor, PieceType } from '../types';

export const createEmptyBoard = (size: number): BoardState => {
  const board = Array(size).fill(null).map(() => Array(size).fill(null));
  
  // Auto-place Kings
  const mid = Math.floor(size / 2);
  board[0][mid] = { type: 'king', color: 'black' };
  board[size - 1][mid] = { type: 'king', color: 'white' };
  
  return board;
};

const isWithinBounds = (pos: Position, size: number) => {
  return pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size;
};

const isPathClear = (board: BoardState, from: Position, to: Position): boolean => {
  const dRow = Math.sign(to.row - from.row);
  const dCol = Math.sign(to.col - from.col);
  
  let currRow = from.row + dRow;
  let currCol = from.col + dCol;

  while (currRow !== to.row || currCol !== to.col) {
    if (board[currRow][currCol] !== null) return false;
    currRow += dRow;
    currCol += dCol;
  }
  return true;
};

export const isValidMove = (
  board: BoardState,
  from: Position,
  to: Position,
  turn: PlayerColor
): boolean => {
  const size = board.length;
  if (!isWithinBounds(to, size)) return false;

  const piece = board[from.row][from.col];
  const target = board[to.row][to.col];

  if (!piece) return false;
  if (piece.color !== turn) return false;
  if (target && target.color === piece.color) return false;

  const dRow = to.row - from.row;
  const dCol = to.col - from.col;
  const absRow = Math.abs(dRow);
  const absCol = Math.abs(dCol);

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.color === 'white' ? -1 : 1;
      // Move forward 1
      if (dCol === 0 && dRow === direction && !target) return true;
      // Capture diagonal
      if (absCol === 1 && dRow === direction && target && target.color !== piece.color) return true;
      // Initial move 2
      const startRow = piece.color === 'white' ? size - 2 : 1;
      if (from.row === startRow && dCol === 0 && dRow === 2 * direction && !target && board[from.row + direction][from.col] === null) return true;
      return false;
    }
    case 'rook':
      if (dRow !== 0 && dCol !== 0) return false;
      return isPathClear(board, from, to);
    case 'bishop':
      if (absRow !== absCol) return false;
      return isPathClear(board, from, to);
    case 'queen':
      if (dRow !== 0 && dCol !== 0 && absRow !== absCol) return false;
      return isPathClear(board, from, to);
    case 'knight':
      return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
    case 'king':
      return absRow <= 1 && absCol <= 1;
    default:
      return false;
  }
};

export const findKing = (board: BoardState, color: PlayerColor): Position | null => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      const p = board[r][c];
      if (p && p.type === 'king' && p.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

export const isKingInCheck = (board: BoardState, kingColor: PlayerColor): boolean => {
  const kingPos = findKing(board, kingColor);
  if (!kingPos) return false;

  const enemyColor = kingColor === 'white' ? 'black' : 'white';

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      const piece = board[r][c];
      if (piece && piece.color === enemyColor) {
        if (isValidMove(board, { row: r, col: c }, kingPos, enemyColor)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const hasValidMoves = (board: BoardState, turn: PlayerColor): boolean => {
    const moves = getAllValidMoves(board, turn);
    return moves.length > 0;
};

// --- Bot Logic Helpers ---

export const getAllValidMoves = (board: BoardState, turn: PlayerColor) => {
    const moves: {from: Position, to: Position}[] = [];
    const size = board.length;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const piece = board[r][c];
            if (piece && piece.color === turn) {
                for (let tr = 0; tr < size; tr++) {
                    for (let tc = 0; tc < size; tc++) {
                        const from = { row: r, col: c };
                        const to = { row: tr, col: tc };
                        
                        if (isValidMove(board, from, to, turn)) {
                             // Hypothetical move check
                             const nextBoard = board.map(row => [...row]);
                             nextBoard[tr][tc] = piece;
                             nextBoard[r][c] = null;
                             if (!isKingInCheck(nextBoard, turn)) {
                                 moves.push({ from, to });
                             }
                        }
                    }
                }
            }
        }
    }
    return moves;
};

export const evaluateBoard = (board: BoardState): number => {
    let score = 0;
    const values: Record<PieceType, number> = {
        pawn: 10,
        knight: 30,
        bishop: 30,
        rook: 50,
        queen: 90,
        king: 900
    };

    for(let r=0; r<board.length; r++){
        for(let c=0; c<board.length; c++){
            const p = board[r][c];
            if(p) {
                const val = values[p.type];
                score += p.color === 'white' ? val : -val;
            }
        }
    }
    return score; // Positive = Good for White, Negative = Good for Black
};

export const countPieces = (board: BoardState, type: PieceType, color: PlayerColor): number => {
    let count = 0;
    for(let row of board) {
        for(let p of row) {
            if(p && p.type === type && p.color === color) count++;
        }
    }
    return count;
}
