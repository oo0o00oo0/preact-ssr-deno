import { createStore } from "zustand/vanilla";
import { useEffect, useState } from "preact/hooks";

interface AppState {
  // Counter state
  counter: number;
  incrementCounter: () => void;
  decrementCounter: () => void;
  resetCounter: () => void;
  setCounter: (value: number) => void;

  // Files state
  files: string[];
  setFiles: (files: string[]) => void;

  // Status state
  status: string[];
  setStatus: (status: string[]) => void;

  // API loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Create vanilla Zustand store
const store = createStore<AppState>((set) => ({
  // Counter state
  counter: 0,
  incrementCounter: () => set((state) => ({ counter: state.counter + 1 })),
  decrementCounter: () => set((state) => ({ counter: state.counter - 1 })),
  resetCounter: () => set({ counter: 0 }),
  setCounter: (value: number) => set({ counter: value }),

  // Files state
  files: [],
  setFiles: (files: string[]) => set({ files }),

  // Status state
  status: [],
  setStatus: (status: string[]) => set({ status }),

  // Loading state
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));

// Create Preact-compatible hook
export const useStore = () => {
  const [state, setState] = useState<AppState>(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return state;
};
