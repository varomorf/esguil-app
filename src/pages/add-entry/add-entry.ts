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
    this.journalEntry = this.formBuilder.group({
      amount: ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      concept: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])]
    });
  }

  createTask() {
    let newEntryModal = this.alertCtrl.create({
      title: 'New Entry',
      message: "Enter a concept and amount for your new entry",
      inputs: [
        {
          name: 'concept',
          placeholder: 'Concept'
        },
        {
          name: 'amount',
          placeholder: 'Amount',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.entriesRef.push({
              date: new Date(),
              concept: data.concept,
              amount: data.amount,
              payers: [],
              targets: []
            });
          }
        }
      ]
    });
    newEntryModal.present(newEntryModal);
  }

  createEntry() {
    this.entriesRef.push(this.journalEntry.value);
  }

}
