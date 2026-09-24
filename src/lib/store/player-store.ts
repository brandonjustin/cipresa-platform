import { create } from 'zustand';
import type { Lesson } from '@/types';

interface PlayerState {
  currentLesson: Lesson | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  setCurrentLesson: (lesson: Lesson | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentLesson: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  setCurrentLesson: (currentLesson) => set({ currentLesson, isPlaying: false, currentTime: 0, duration: 0 }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  reset: () => set({
    currentLesson: null, isPlaying: false, currentTime: 0,
    duration: 0, playbackRate: 1, volume: 1, isMuted: false, isFullscreen: false,
  }),
}));
