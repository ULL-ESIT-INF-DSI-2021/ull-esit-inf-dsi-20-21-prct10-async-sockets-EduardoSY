import {Note} from './note';
export type RequestType = {
  type: 'add' | 'remove' | 'modify' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: string;
}

export type ResponseType = {
  type: 'add' | 'remove' | 'modify' | 'read' | 'list';
  status: boolean; // True means OK. False means FAIL.
  notas?: string[];
}