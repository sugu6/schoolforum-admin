export interface Options {
  value: unknown;
  label: string;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface AnyObject extends Record<string, unknown> {}
