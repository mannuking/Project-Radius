interface Window {
  process: {
    env: Record<string, string | undefined>;
    nextTick: (fn: Function) => void;
    browser: boolean;
    version: string;
    release: Record<string, any>;
    platform: string;
    title: string;
    argv: string[];
    pid: number;
    cwd: () => string;
  };
} 
