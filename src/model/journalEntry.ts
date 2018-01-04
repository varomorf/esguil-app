export class JournalEntry {
  date: Date;
  concept: string;
  amount: number;
  payers: string[];
  targets: string[];

  constructor () {
    this.date = new Date();
  }
}
