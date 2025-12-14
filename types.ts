export type PlayerColor = 'white' | 'black';

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export type BoardState = (Piece | null)[][];

export type GameMode = 'PvP' | 'PvE';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export interface GameConfig {
  mode: GameMode;
  difficulty: Difficulty;
  boardSize: number;
  initialBoard: BoardState;
}

export interface Move {
  from: Position;
  to: Position;
}
