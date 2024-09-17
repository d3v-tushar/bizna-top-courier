import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LogRecordStore<T> {
  logs: T[];
  addLog: (data: T) => void;
  resetLogs: () => void;
}

export const createLogRecord = <T>() =>
  create(
    persist<LogRecordStore<T>>(
      (set) => ({
        logs: [],
        addLog: (data) => set((state) => ({ logs: [data, ...state.logs] })),
        resetLogs: () => set({ logs: [] }),
      }),
      {
        name: 'log-record-store',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
