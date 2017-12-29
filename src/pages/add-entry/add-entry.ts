import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {JournalEntry} from "../../model/journalEntry";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-add-entry',
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {

  private journalEntry: FormGroup;
  entriesRef: AngularFireList<JournalEntry>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public db: AngularFireDatabase,
              public formBuilder: FormBuilder) {
    this.entriesRef = db.list('entries');
    this.initForm();
  }

  initForm() {
    this.journalEntry = this.formBuilder.group({
      amount: ['0', Validators.compose([Validators.required, Validators.min(0.01)])],
      concept: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],
      payers: ['']
    });
  }

  createEntry() {
    this.entriesRef
      .push(this.journalEntry.value)
      .then(data => {
        let newEntryModal = this.alertCtrl.create({
          title: 'New Entry Added',
          message: "The new entry has been added",
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.initForm();
              }
            }
          ]
        });
        newEntryModal.present(newEntryModal);
      });


  }

}
