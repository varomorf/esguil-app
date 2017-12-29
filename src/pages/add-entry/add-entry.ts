import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {JournalEntry} from "../../model/journalEntry";

@Component({
  selector: 'page-add-entry',
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {

  entriesRef: AngularFireList<JournalEntry>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public db: AngularFireDatabase) {
    this.entriesRef = db.list('entries');
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

}
