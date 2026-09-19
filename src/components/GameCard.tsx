import React from 'react';
import { Play, Star } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectGame: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame
}) => {
  return (
    <div
      id={`game-card-${game.id}`}
      className="group bg-white rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Banner Area */}
        <div
          className="h-36 w-full relative flex items-center justify-center overflow-hidden border-b border-slate-100 transition-colors bg-slate-900"
          style={{ backgroundColor: game.thumbnailColor || '#0f172a' }}
        >
          {game.thumbnailImage ? (
            <img
              src={game.thumbnailImage}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-center group-hover:scale-105 transition-transform duration-200 p-4">
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-1 flex items-center justify-center text-white font-extrabold text-xl shadow-xs"
                style={{ backgroundColor: game.thumbnailColor || '#0f172a' }}
              >
                {game.title.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-white/90">{game.title}</span>
            </div>
          )}

          {/* Badge & Category */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 rounded-md shadow-2xs">
              {game.category}
            </span>
            {game.badge && (
              <span
                className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase text-white rounded-md shadow-2xs"
                style={{ backgroundColor: game.thumbnailColor || '#0f172a' }}
              >
                {game.badge}
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            id={`fav-btn-${game.id}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-500 hover:text-amber-500 border border-slate-200/80 transition-colors shadow-2xs z-10"
          >
            <Star
              className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-500' : ''}`}
            />
          </button>

          {/* Quick Play Hover Button */}
          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-2xs z-10">
            <button
              onClick={() => onSelectGame(game)}
              className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 hover:bg-slate-100 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Launch Game
            </button>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-base text-slate-900 tracking-tight leading-snug">
              {game.title}
            </h3>
            {game.rating && (
              <div className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                ★ {game.rating.toFixed(1)}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="px-4 pb-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="text-[11px] font-medium text-slate-500">
          {game.plays ? `${game.plays} plays` : 'HTML5'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectGame(game)}
            className="inline-flex items-center gap-1 px-3 py-1.5 font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
