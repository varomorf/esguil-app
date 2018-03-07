import * as moment from 'moment';
import {Member} from "./member";

export class FBJournalEntry {
	$key: string;
	groupId: string;
	date: string;
	concept: string;
	amount: number;
	commonExpense: boolean;
	payers: string[];
	targets: string[];

	static fromObject(data: any): FBJournalEntry {
		let fb = new FBJournalEntry();

		Object.assign(fb, data);

		if(typeof data.amount === typeof ''){
			fb.amount = Number(data.amount);
		}

		return fb;
	}
}

export class JournalEntry {
	$key: string;
	groupId: string;
	date: Date;
	concept: string;
	amount: number;
	commonExpense: boolean = true;
	payers: Member[];
	targets: Member[];

	constructor() {
		this.date = new Date();
	}

	static fromObject(data: FBJournalEntry, members: Member[]): JournalEntry {
		let journalEntry = new JournalEntry();

		journalEntry.$key = data.$key;
		journalEntry.groupId = data.groupId;
		journalEntry.date = moment(data.date).toDate();
		journalEntry.concept = data.concept;
		journalEntry.amount = Number(data.amount);
		journalEntry.commonExpense = data.commonExpense;
		journalEntry.targets = data.targets.map(t => {
			return members.find(m => m.$key === t)
		});
		journalEntry.payers = data.payers.map(p => {
			return members.find(m => m.$key === p)
		});

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
