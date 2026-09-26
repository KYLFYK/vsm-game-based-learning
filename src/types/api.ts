export namespace Api {
  export enum ErrorCode {
    NotFound = 'not-found',
    Storage = 'storage',
    InvalidScenario = 'invalid-scenario',
  }

  export interface Error {
    status: 'CUSTOM_ERROR';
    error: ErrorCode;
  }
}
