import { TextDecoder, TextEncoder } from 'node:util';

// jsdom не даёт TextEncoder/TextDecoder, а react-router 8 создаёт их при импорте
Object.assign(globalThis, { TextDecoder, TextEncoder });
