///<reference path="../../../node_modules/angularfire2/database/interfaces.d.ts"/>
import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import {JournalEntry} from "../../model/journalEntry";
import * as firebase from "firebase";
import ThenableReference = firebase.database.ThenableReference;

@Injectable()
export class EntryProvider {

  private entriesRef: AngularFireList<JournalEntry>;

  constructor(private db: AngularFireDatabase,
              private auth: AngularFireAuth) {
    this.entriesRef = db.list('entries');
  }

  create(entry: JournalEntry): ThenableReference {
    let entryData = {};
    Object.assign(entryData, entry);

    entryData['date'] = entry.date.toISOString();

    return this.entriesRef.push(entryData as JournalEntry);
  }

}
