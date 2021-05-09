/**
 * Definicion del tipo de dato para las peticiones
 */
export type RequestType = {
  type: 'add' | 'remove' | 'modify' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: string;
}

/**
 * Definicion del tipo de dato para las respuestas
 */
export type ResponseType = {
  type: 'add' | 'remove' | 'modify' | 'read' | 'listar';
  status: boolean; // True means OK. False means FAIL.
  notas?: string[];
}