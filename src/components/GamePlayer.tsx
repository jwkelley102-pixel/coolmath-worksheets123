import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Maximize2, Minimize2, RotateCcw, ExternalLink, Star, Info, Gamepad2 } from 'lucide-react';
import { Game } from '../types';
import { extractIframeSrc } from '../utils/iframeHelper';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectOtherGame: (game: Game) => void;
  allGames: Game[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectOtherGame,
  allGames
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const iframeSrc = extractIframeSrc(game.iframe);

  const focusGameFrame = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.focus();
      }
    } catch {
      // Cross-origin restriction fallback
      iframeRef.current?.focus();
    }
  };

  useEffect(() => {
    // Focus game frame on mount or reload
    const timer = setTimeout(() => {
      focusGameFrame();
    }, 400);
    return () => clearTimeout(timer);
  }, [game.id, iframeKey]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(focusGameFrame, 150);
      }).catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(focusGameFrame, 150);
      }).catch(err => {
        console.warn('Exit fullscreen error:', err);
      });
    }
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    if (iframeSrc) {
      window.open(iframeSrc, '_blank');
    }
  };

  // Related games (same category or popular)
  const relatedGames = allGames
    .filter(g => g.id !== game.id)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          id="back-to-games-button"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </button>

        <div className="flex items-center gap-3">
          {game.thumbnailImage && (
            <img
              src={game.thumbnailImage}
              alt={game.title}
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{game.title}</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700 rounded-full">
              {game.category}
            </span>
          </div>
        </div>

        {/* Player action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 text-slate-600 hover:text-amber-500 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleReload}
            id="reload-game-button"
            title="Reload game frame"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenExternal}
            id="open-tab-button"
            title="Open game source directly"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            id="fullscreen-game-button"
            title="Toggle fullscreen"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors shadow-2xs"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Controls Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Ready to Play</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span>P1: <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono font-bold text-white text-[11px]">W</kbd></span>
            <span className="text-slate-500">•</span>
            <span>P2: <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono font-bold text-white text-[11px]">↑</kbd></span>
          </div>
        </div>

        <button
          onClick={focusGameFrame}
          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded text-[11px] transition-colors shadow-2xs flex items-center gap-1"
        >
          Click to Focus Game
        </button>
      </div>

      {/* Main Game Screen Container */}
      <div
        ref={containerRef}
        onClick={focusGameFrame}
        id="game-viewport"
        className={`relative bg-black border-2 border-slate-900 rounded-xl overflow-hidden shadow-md flex flex-col ${
          isFullscreen ? 'w-full h-full rounded-none border-0' : 'aspect-16/10 min-h-[460px] max-h-[720px]'
        }`}
      >
        {isFullscreen && (
          <div className="absolute top-3 right-3 z-50">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 bg-slate-900/90 hover:bg-black text-white text-xs font-semibold rounded-lg backdrop-blur-sm flex items-center gap-1.5 shadow-md"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              Exit Fullscreen
            </button>
          </div>
        )}

        {/* Embedded Iframe */}
        {iframeSrc ? (
          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={iframeSrc}
            id={`game-frame-${game.id}`}
            title={game.title}
            className="w-full h-full border-0 flex-1 bg-black"
            allow="autoplay; payment; fullscreen; microphone; focus-without-user-activation *; screen-wake-lock; gamepad; clipboard-read; clipboard-write; accelerometer; gyroscope; keyboard-map;"
            allowFullScreen
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox"
            loading="eager"
            onLoad={focusGameFrame}
          />
        ) : game.iframe && game.iframe.trim().length > 0 ? (
          <iframe
            ref={iframeRef}
            key={iframeKey}
            srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#0f172a;color:#fff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;}</style></head><body>${game.iframe}</body></html>`}
            id={`game-frame-${game.id}`}
            title={game.title}
            className="w-full h-full border-0 flex-1 bg-black"
            allow="autoplay; payment; fullscreen; microphone; focus-without-user-activation *; screen-wake-lock; gamepad; clipboard-read; clipboard-write; accelerometer; gyroscope; keyboard-map;"
            allowFullScreen
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox"
            loading="eager"
            onLoad={focusGameFrame}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
            <Info className="w-10 h-10 text-slate-400 mb-2" />
            <p className="font-semibold text-slate-800">No game content provided</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
              This game entry does not contain a valid iframe or embed source.
            </p>
          </div>
        )}
      </div>

      {/* Game Details & Stored JSON Iframe Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column: Description & Controls */}
        <div className="md:col-span-2 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              About {game.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {game.description}
            </p>

            {game.controls && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  How to Play & Controls
                </span>
                <p className="text-xs font-medium text-slate-800">
                  {game.controls}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: More Games */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">More Unblocked Games</h3>
            <div className="space-y-2.5">
              {relatedGames.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectOtherGame(rel)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs"
                      style={{ backgroundColor: rel.thumbnailColor || '#0f172a' }}
                    >
                      {rel.title.charAt(0)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {rel.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">{rel.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 shrink-0">
                    Play →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
