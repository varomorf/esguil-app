import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {Member} from "../../model/member";
import {Observable} from "rxjs/Observable";

const MEMBERS_PATH = 'members';

@Injectable()
export class MemberService {

  private membersRef: AngularFireList<Member>;
  members: Observable<Member[]>;

  constructor(private db: AngularFireDatabase) {
    this.membersRef = this.db.list<Member>(MEMBERS_PATH);
    this.members = this.membersRef.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({$key: c.payload.key, ...c.payload.val()}));
      });
  }

}
