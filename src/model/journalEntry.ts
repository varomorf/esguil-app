export class JournalEntry {
  groupId: string;
  date: Date;
  concept: string;
  amount: number;
  payers: string[];
  targets: string[];

  constructor () {
    this.date = new Date();
  }
}
