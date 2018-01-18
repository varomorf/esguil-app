///<reference path="../../../node_modules/angularfire2/database/interfaces.d.ts"/>
import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {GroupedEntries, JournalEntry} from "../../model/journalEntry";
import * as firebase from "firebase";
import {CurrentUserProvider} from "../users/CurrentUserProvider";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import ThenableReference = firebase.database.ThenableReference;

@Injectable()
export class EntryProvider {

	public entriesRef: AngularFireList<JournalEntry>;

	constructor(private db: AngularFireDatabase,
				private currentUser: CurrentUserProvider) {
		this.currentUser.currentUserObservable.subscribe(currentUser =>
			this.entriesRef = db.list('entries', ref => ref.orderByChild('groupId').equalTo(currentUser.groupId))
		);
	}

	create(entry: JournalEntry): ThenableReference {
		let entryData = {};
		Object.assign(entryData, entry);

		entryData['date'] = entry.date.toISOString();

		return this.entriesRef.push(entryData as JournalEntry);
	}

	getGroupedEntries(): Observable<GroupedEntries[]> {
		return this.entriesRef.valueChanges()
			.map(entries => {
				console.log(entries);

				let groupedEntries = [] as GroupedEntries[];

				entries.forEach(e => {
					let entry = JournalEntry.fromObject(e);

					let key = moment(entry.date).format("MM/YYYY");

					let i = groupedEntries.findIndex(g => g.key === key);
					let grouped: GroupedEntries;
					if (i === -1) {
						grouped = new GroupedEntries();
						grouped.key = key;

						groupedEntries.push(grouped);
					} else {
						grouped = groupedEntries[i];
					}

					grouped.addEntry(entry);
				});

				return groupedEntries;
			});
	}

}
