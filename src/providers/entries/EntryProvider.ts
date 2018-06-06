///<reference path="../../../node_modules/angularfire2/database/interfaces.d.ts"/>
import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {FBJournalEntry, GroupedEntries, JournalEntry} from "../../model/journalEntry";
import {CurrentUserProvider, SIGNED_IN_USER} from "../users/CurrentUserProvider";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {MemberProvider} from "../members/MemberProvider";
import {Events} from "ionic-angular";
import {Member} from "../../model/member";

@Injectable()
export class EntryProvider {

	public entriesRef: AngularFireList<FBJournalEntry>;
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

	create(entry: FBJournalEntry): Promise<any> {
		return new Promise<any>(resolve => {
			delete entry.$key;
			entry.groupId = this.currentUser.groupId;

			// if it's a common expense, the targets are all of the group's members
			if (entry.commonExpense) {
				this.memberProvider.getMembers().subscribe(members => {
					entry.targets = members.map(m => m.$key);

					return this.entriesRef.push(entry).then(resolve);
				});
			} else {
				return this.entriesRef.push(entry).then(resolve);
			}
		});
	}

	edit(entry: FBJournalEntry): Promise<any> {
		let update = (e: FBJournalEntry, resolve) => {
			const $key = e.$key;
			delete e.$key;
			return this.entriesRef.update($key, e).then(resolve);
		};

		return new Promise<any>(resolve => {
			entry.groupId = this.currentUser.groupId;

			// if it's a common expense, the targets are all of the group's members
			if (entry.commonExpense) {
				this.memberProvider.getMembers().subscribe(members => {
					entry.targets = members.map(m => m.$key);

					return update(entry, resolve);
				});
			} else {
				return update(entry, resolve);
			}
		});
	}

	public delete(entry: JournalEntry): Promise<void> {
		if (entry.$key) {
			return this.entriesRef.remove(entry.$key);
		} else {
			return Promise.resolve();
		}
	}

	getGroupedEntries(): Observable<GroupedEntries[]> {
		return this.getEntries()
			.map(entries => {
				let groupedEntries = [] as GroupedEntries[];

				entries.forEach(entry => {
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
					grouped.entries.sort((a, b) => {
						return a.date.getTime() - b.date.getTime();
					});
				});

				return groupedEntries.sort((a, b) => {
					return b.entries[0].date.getTime() - a.entries[0].date.getTime();
				});
			});
	}

	private getEntries(): Observable<JournalEntry[]> {
		return new Observable<JournalEntry[]>(subscriber => {
			this.memberProvider.getMembers().subscribe(members => {
				this.entriesRef.snapshotChanges()
					.map(changes => {
						return changes.map(c => ({$key: c.payload.key, ...c.payload.val()}));
					})
					.map(entries => entries.map(e => JournalEntry.fromObject(e, members)))
					.subscribe(e => subscriber.next(e));
			});
		});
	}

}
