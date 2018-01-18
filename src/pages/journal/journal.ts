import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {GroupedEntries} from "../../model/journalEntry";
import {EntryProvider} from "../../providers/entries/EntryProvider";

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
		this.entryProvider.getGroupedEntries()
			.subscribe(groupedEntries => this.groupedEntries = groupedEntries);
	}

}
