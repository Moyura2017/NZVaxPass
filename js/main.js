import { decoder } from './nzvaxpass.js';
export const decode = (qrCode) => decoder(qrCode); 
//export function decode(qrCode) { return decoder(qrCode);}