import { Player } from '@/types/Player';

let id = 0;

export const mockPlayers: Array<Player> = [
  /* basic starting 5 for one team */
  { id: id++, name: "K. Irving", number: "2", },
  { id: id++, name: "J.R. Smith", number: "5", },
  { id: id++, name: "L. James", number: "23", },
  { id: id++, name: "K. Love", number: "0", },
  { id: id++, name: "T. Thompson", number: "13", },
];
