import React, { useState } from 'react';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { EditorScreen } from './screens/EditorScreen';
import { GameScreen } from './screens/GameScreen';
import { GameConfig, GameMode, Difficulty } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'editor' | 'game'>('welcome');
  const [config, setConfig] = useState<Partial<GameConfig>>({});

  const handleModeSelect = (mode: GameMode, difficulty: Difficulty) => {
    setConfig({ mode, difficulty });
    setCurrentScreen('editor');
  };

  const handleStartGame = (finalConfig: GameConfig) => {
    setConfig(finalConfig);
    setCurrentScreen('game');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
    setConfig({});
  };

  const handleBackToEditor = () => {
      setCurrentScreen('editor');
  }

  return (
    <div className="antialiased font-sans">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onNext={handleModeSelect} />
      )}
      {currentScreen === 'editor' && (
        <EditorScreen 
            config={config} 
            onStartGame={handleStartGame} 
            onBack={handleBackToWelcome} 
        />
      )}
      {currentScreen === 'game' && config.initialBoard && (
        <GameScreen 
            config={config as GameConfig} 
            onBack={handleBackToEditor} 
        />
      )}
    </div>
  );
};

export default App;
