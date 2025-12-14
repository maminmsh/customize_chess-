import React from 'react';
import { Piece as PieceType } from '../types';

interface PieceProps {
  piece: PieceType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Piece: React.FC<PieceProps> = ({ piece, className = '' }) => {
  const isWhite = piece.color === 'white';
  
  // High quality SVG paths for standard chess pieces (Based on Cburnett/Merida style)
  // ViewBox 0 0 45 45
  const getPieceContent = (type: string) => {
    const stroke = isWhite ? "#78350f" : "#e9d5ff"; // Contrast stroke
    const strokeWidth = 1.5;

    switch (type) {
      case 'pawn':
        return (
          <path 
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            stroke={stroke} strokeWidth={strokeWidth}
          />
        );
      case 'rook':
        return (
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
             <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
             <path d="M34 14l-3 3H14l-3-3" />
             <path d="M31 17v12.5c0 2-1 2-1 2H15c0 0-1 0-1-2V17" />
             <path d="M31 29.5l2.5 2.5h-22l2.5-2.5" />
             <path d="M11 14h23" />
          </g>
        );
      case 'knight':
        return (
            <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18 C 23.38,20.91 17.45,25.37 15,27 C 12,29 12.18,31.34 10,31 C 8.958,30.06 11.41,27.96 10,28 C 10,28 11.19,25.06 10,25 C 9,25 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10 Z" />
                <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5 25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" fill={stroke} stroke="none" />
                <path d="M 15 15.5 A 0.5 1.5 0 1 1 14 15.5 A 0.5 1.5 0 1 1 15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill={stroke} stroke="none" /> 
            </g>
        );
      case 'bishop':
        return (
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
             <g transform="translate(0,0)">
                <path d="M9 36c3.39-.97 9.11-.48 13.5-2 4.39 1.52 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-9.11-.48-13.5-2-4.39 1.52-10.11 1.03-13.5 2-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
                <path d="M15 32c2.52-.28 9-1 15 0 .95-1.92 2.72-3.49 4-5 1.28-1.51 5.06-4.94 2-10-1.89-3.13-4.59-4.75-8-5.5.89-2.78-1.02-4.88-3.5-5.5-3.89 1.5-6.67 4.54-5.5 11C18 23 18 28 15 32z" />
                <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
             </g>
             <path d="M17.5 26h10M15 30h15" fill="none" />
          </g>
        );
      case 'queen':
        return (
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-11 11-5.5-13.5L16 25 6 14l3 12z"/>
            <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 1.5 4.5 1.5 4.5l.5 4h18l.5-4s.5-2 1.5-4.5c1-2 2.5-2 2.5-4" />
            <path d="M11 30c3.5-1 18.5-1 23 0M11 34c3.5-1 18.5-1 23 0" fill="none" />
          </g>
        );
      case 'king':
        return (
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63c4.5 0 8.5 4 8.5 9 0 2-1 4-2 6 1 3 1.5 6 1.5 7.5H14.5c0-1.5.5-4.5 1.5-7.5-1-2-2-4-2-6 0-5 4-9 8.5-9z" />
            <path d="M12 36v-4h21v4H12z" />
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7h-21v7z" />
            <path d="M11.5 30c5.5-3 15.5-3 21 0" fill="none" />
            <path d="M11.5 33.5c5.5-3 15.5-3 21 0" fill="none" />
            <path d="M22.5 11v-6" fill="none" />
            <path d="M20 8h5" fill="none" />
          </g>
        );
      default:
        return null;
    }
  };

  // Fancy Gradients and Filters
  const defs = (
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#581c87" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.5)" />
      </filter>
    </defs>
  );

  return (
    <div 
        className={`
            w-full h-full flex items-center justify-center
            select-none pointer-events-none
            transition-all duration-300
            ${className}
        `}
    >
      <svg 
        viewBox="0 0 45 45" 
        width="100%" 
        height="100%" 
        fill={isWhite ? "url(#goldGradient)" : "url(#darkGradient)"}
        style={{
            overflow: 'visible',
            filter: 'url(#shadow)'
        }}
      >
        {defs}
        {getPieceContent(piece.type)}
      </svg>
    </div>
  );
};
