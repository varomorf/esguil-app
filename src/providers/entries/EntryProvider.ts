///<reference path="../../../node_modules/angularfire2/database/interfaces.d.ts"/>
import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {JournalEntry} from "../../model/journalEntry";
import * as firebase from "firebase";
import {CurrentUserProvider} from "../users/CurrentUserProvider";
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

}
