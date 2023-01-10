export interface Player {
  rating: number;
  name: string;
  goalKeeper: boolean;
  highPriority?: boolean;
  lowPririty?: boolean;
}
