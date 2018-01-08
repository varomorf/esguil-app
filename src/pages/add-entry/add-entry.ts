import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {JournalEntry} from "../../model/journalEntry";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberService} from "../../app/members/member.service";
import {Member} from "../../model/member";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'page-add-entry',
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {

  private journalEntry: FormGroup;
  private entriesRef: AngularFireList<JournalEntry>;
  private members : Observable<Member[]>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public db: AngularFireDatabase,
              public formBuilder: FormBuilder,
              private memberService: MemberService) {
    this.entriesRef = db.list('entries');
    this.initForm();
    this.members = this.memberService.members;
  }

  initForm() {
    this.journalEntry = this.formBuilder.group({
      amount: ['0', Validators.compose([Validators.required, Validators.min(0.01)])],
      concept: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],
      payers: ['', Validators.required],
      commonExpense: ['true', Validators.required],
      targets: ['', Validators.required]
    });
  }

  createEntry() {
    let entry = new JournalEntry();
    Object.assign(entry, this.journalEntry.value);

    this.entriesRef
      .push(entry)
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
