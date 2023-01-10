import { Player } from "./player";

export interface Team {
  players: Player[];
  rating: number;
  lowPriorityCount: number;
}
