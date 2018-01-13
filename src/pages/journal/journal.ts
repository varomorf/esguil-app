import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {JournalEntry} from "../../model/journalEntry";
import {EntryProvider} from "../../providers/entries/EntryProvider";

@Component({
  selector: 'page-journal',
  templateUrl: 'journal.html'
})
export class JournalPage {
  entries: Observable<JournalEntry[]>;

  constructor(public navCtrl: NavController,
              private entryProvider: EntryProvider) {
    this.entries = this.entryProvider.entriesRef.valueChanges();
  }

  removeEntry() {

  }

}
