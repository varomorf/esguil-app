import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {JournalEntry} from "../../model/journalEntry";
import {EntryProvider} from "../../providers/entries/EntryProvider";
import * as moment from "moment";

@Component({
	selector: 'page-journal',
	templateUrl: 'journal.html'
})
export class JournalPage {
	groupedEntries: Array<GroupedEntries> = [];

	constructor(public navCtrl: NavController,
				private entryProvider: EntryProvider) {
	}

	ionViewDidLoad() {
		this.entryProvider.entriesRef.valueChanges()
			.subscribe(entries => {
				console.log(entries);

				entries.forEach(e => {
					let entry = JournalEntry.fromObject(e);

					let key = moment(entry.date).format("MM/YYYY");

					let i = this.groupedEntries.findIndex(g => g.key === key);
					let grouped: GroupedEntries;
					if (i === -1) {
						grouped = new GroupedEntries();
						grouped.key = key;

						this.groupedEntries.push(grouped);
					} else {
						grouped = this.groupedEntries[i];
					}

					grouped.addEntry(entry);
				});
			});
	}

}

class GroupedEntries {
	key: string;
	total: number = 0;

	showEntries: boolean = false;

	entries: Array<JournalEntry> = [];

	addEntry(entry: JournalEntry) {
		this.total += entry.amount;

		this.entries.push(entry);
	}

}
