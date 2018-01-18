import * as moment from 'moment';

export class JournalEntry {
	groupId: string;
	date: Date;
	concept: string;
	amount: number;
	payers: string[];
	targets: string[];

	constructor() {
		this.date = new Date();
	}

	static fromObject(data: any): JournalEntry {
		let journalEntry = new JournalEntry();

		journalEntry.groupId = data.groupId;
		journalEntry.date = moment(data.date).toDate();
		journalEntry.concept = data.concept;
		journalEntry.amount = Number(data.amount);
		journalEntry.payers = data.payers;
		journalEntry.targets = data.targets;

		return journalEntry;
	}

}

export class GroupedEntries {
	key: string;
	total: number = 0;

	showEntries: boolean = false;

	entries: Array<JournalEntry> = [];

	addEntry(entry: JournalEntry) {
		this.total += entry.amount;

		this.entries.push(entry);
	}

}
