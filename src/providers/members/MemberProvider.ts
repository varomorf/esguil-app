import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {Member} from "../../model/member";
import {Observable} from "rxjs/Observable";
import {Events} from "ionic-angular";
import {SIGNED_IN_USER} from "../users/CurrentUserProvider";

const MEMBERS_PATH = 'members';

@Injectable()
export class MemberProvider {

	private membersRef: AngularFireList<Member>;
	private members: Observable<Member[]>;

	constructor(private db: AngularFireDatabase,
				private events: Events) {
		this.events.subscribe(SIGNED_IN_USER, (currentUser) => {
			this.membersRef = db.list<Member>(MEMBERS_PATH, ref => ref.orderByChild('groupId').equalTo(currentUser.groupId))
			this.members = this.membersRef.snapshotChanges()
				.map(changes => {
					return changes.map(c => ({$key: c.payload.key, ...c.payload.val()}));
				});
		});
	}

	public getMembers(): Observable<Member[]> {
		if (this.members) {
			return this.members;
		} else {
			return this.membersRef.snapshotChanges()
				.map(changes => {
					return changes.map(c => ({$key: c.payload.key, ...c.payload.val()}));
				});
		}
	}

}
