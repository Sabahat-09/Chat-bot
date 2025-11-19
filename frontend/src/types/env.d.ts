declare namespace NodeJS {
  interface ProcessEnv {
    API_URL?: string;
    WS_URL?: string;
  }
}

declare const process: {
  env: {
    API_URL?: string;
    WS_URL?: string;
  };
};

