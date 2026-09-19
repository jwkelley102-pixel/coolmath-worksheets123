/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Game, CategoryFilter } from './types';
import { Navbar } from './components/Navbar';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { Gamepad2, Sparkles, Filter, Globe } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unblocked_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch games
  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then((data: Game[]) => {
        setGames(data);
      })
      .catch(err => {
        console.error('Failed to load games:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unblocked_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }
  }, [favorites]);

  // Update document title
  useEffect(() => {
    document.title = activeGame ? `${activeGame.title} - Unblocked Games` : 'Unblocked Games';
  }, [activeGame]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter(g => {
      // Category filter
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(g.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (g.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = g.title.toLowerCase().includes(query);
        const matchesDesc = g.description.toLowerCase().includes(query);
        const matchesCat = g.category.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [games, selectedCategory, searchQuery, favorites]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-slate-900 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
            onSelectOtherGame={(game) => {
              setActiveGame(game);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            allGames={games}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header Showcase Banner */}
            <div className="mb-8 p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 mb-3 shadow-2xs">
                  <Gamepad2 className="w-3.5 h-3.5 text-slate-900" />
                  <span>Free Unblocked Games</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Unblocked Games Library
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Play top unblocked games directly in your browser. Fast loading, responsive fullscreen support, and zero downloads required.
                </p>

                {/* Quick stats pills */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-5 pt-5 border-t border-slate-200/80 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-semibold text-slate-900">{games.length} Games</span> Available
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Instant Play</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Browser-Based</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-900">
                  {selectedCategory === 'All' ? 'All Games' : `${selectedCategory} Games`}
                </span>
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {filteredGames.length}
                </span>
              </div>

              {searchQuery && (
                <div className="text-xs text-slate-500">
                  Showing results for "<span className="font-semibold text-slate-800">{searchQuery}</span>"
                </div>
              )}
            </div>

            {/* Game Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelectGame={(g) => {
                      setActiveGame(g);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto my-6">
                <Gamepad2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {games.length === 0 ? 'No games available' : 'No games found'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {games.length === 0
                    ? 'All games have been removed. The game catalog is currently empty.'
                    : searchQuery
                    ? `No games matched "${searchQuery}". Try a different keyword.`
                    : 'No games in this category yet.'}
                </p>
                <div className="flex justify-center gap-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Clear Search
                    </button>
                  )}
                  {games.length > 0 && selectedCategory !== 'All' && (
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                      Show All Games
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Unblocked Games</span>
            <span>—</span>
            <span>Free online arcade and classic browser games</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveGame(null);
                setSelectedCategory('All');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-600 hover:text-slate-900 hover:underline"
            >
              Back to Top
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
