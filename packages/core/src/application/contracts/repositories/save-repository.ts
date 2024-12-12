export interface SaveRepository<T> {
  save: (data: T) => Promise<void>;
}
