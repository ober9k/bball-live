import { Player } from '@/types/Player';

let id = 0;

export const mockPlayers: Array<Player> = [
  /* basic starting 5 for one team */
  { id: id++, name: "K. Irving", number: "2", },
  { id: id++, name: "J.R. Smith", number: "5", },
  { id: id++, name: "L. James", number: "23", },
  { id: id++, name: "K. Love", number: "0", },
  { id: id++, name: "T. Thompson", number: "13", },
  /* bench players for the same team */
  { id: id++, name: "I. Shumpert", number: "4", },
  { id: id++, name: "R. Jefferson", number: "24", },
  { id: id++, name: "M. Dellavedova", number: "8", },
  { id: id++, name: "C. Frye", number: "9", },
  { id: id++, name: "M. Williams", number: "52", },
];
