import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {JournalEntry} from "../../model/journalEntry";

@Component({
  selector: 'page-journal',
  templateUrl: 'journal.html'
})
export class JournalPage {

  entriesRef: AngularFireList<JournalEntry>;
  entries: Observable<JournalEntry[]>;

  constructor(public navCtrl: NavController,
              public db: AngularFireDatabase) {
    this.entriesRef = this.db.list('entries');
    this.entries = this.entriesRef.valueChanges();
  }

}
