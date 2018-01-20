///<reference path="../../../node_modules/angularfire2/database/interfaces.d.ts"/>
import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {GroupedEntries, JournalEntry} from "../../model/journalEntry";
import {CurrentUserProvider, SIGNED_IN_USER} from "../users/CurrentUserProvider";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {MemberProvider} from "../members/MemberProvider";
import {Events} from "ionic-angular";
import {Member} from "../../model/member";

@Injectable()
export class EntryProvider {

	public entriesRef: AngularFireList<JournalEntry>;
	public currentUser: Member;

	constructor(private db: AngularFireDatabase,
				private currentUserProvider: CurrentUserProvider,
				private memberProvider: MemberProvider,
				private events: Events) {
		this.events.subscribe(SIGNED_IN_USER, (currentUser) => {
			this.currentUser = currentUser;
			this.entriesRef = db.list('entries', ref => ref.orderByChild('groupId').equalTo(currentUser.groupId))
		});
	}

	create(entry: JournalEntry): Promise<any> {
		return new Promise<any>(resolve => {
			entry.groupId = this.currentUser.groupId;
			entry.date = new Date();

			this.memberProvider.getMembers().toPromise().then(members => console.log(members));

			// if it's a common expense, the targets are all of the group's members
			if (entry.commonExpense) {
				this.memberProvider.getMembers().subscribe(members => {
					entry.targets = members;

					this.saveEntry(entry).then(resolve);
				});
			} else {
				this.saveEntry(entry).then(resolve);
			}
		});
	}

	getGroupedEntries(): Observable<GroupedEntries[]> {
		return this.entriesRef.valueChanges()
			.map(entries => {
				console.log(entries);

				let groupedEntries = [] as GroupedEntries[];

				entries.forEach(e => {
					let entry = JournalEntry.fromObject(e);

					let key = moment(entry.date).format("MMMM YYYY");

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

	private saveEntry(entry: JournalEntry): Promise<any> {
		return new Promise<any>(resolve => {
			let entryData: any = {};
			Object.assign(entryData, entry);

			// convert date before saving (firebase can only use strings)
			entryData.date = entry.date.toISOString();

			// extract target IDs
			entryData.targets = entryData.targets.map(m => m.$key);

			this.entriesRef.push(entryData as JournalEntry).then(resolve);
		});
	}

}
