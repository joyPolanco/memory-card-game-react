import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  score: 0,
  moves: 0,
  configuration: null,
  setConfiguration: (config) => {
    set({ configuration: config });
  },
  restoreAppConfiguration: () => {
    set({ configuration: null });
  },
  isPlaying: false,
  setIsPlaying: (value) => {
    set({ isPlaying: value });
  },
  startPlaying: () => {
    set({ isPlaying: true, isRunning: true }); 
  },
  stopPlaying: () => {
    set({ isPlaying: false, isRunning: false }); 
  },
  isRunning: true, 
  setIsRunning: (value) => {
    set({ isRunning: value });
  },
  resetGame: () => set({ isPlaying: false, isRunning: true, score: 0, moves: 0 }),
  setScore: (score) => set({ score }),
  setMoves: (moves) => set({ moves }),
  clearConfiguration: () => {
    localStorage.removeItem("game_configuration");
    localStorage.removeItem("game_state");
    localStorage.removeItem("game_timestamp");
    set({ configuration: null, isPlaying: false, isRunning: false });
  }
}));

export default useAppStore;