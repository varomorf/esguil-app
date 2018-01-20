import {Component} from '@angular/core';
import {AlertController, Events, NavController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {JournalEntry} from "../../model/journalEntry";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberProvider} from "../../providers/members/MemberProvider";
import {Member} from "../../model/member";
import {Observable} from "rxjs/Observable";
import {NewEntryTargetsValidator} from "../../app/entries/validators/newEntryValidator";
import {CurrentUserProvider, SIGNED_IN_USER} from "../../providers/users/CurrentUserProvider";
import {EntryProvider} from "../../providers/entries/EntryProvider";
import {noop} from "rxjs/util/noop";

@Component({
  selector: 'page-add-entry',
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {

  private journalEntry: FormGroup;
  private entriesRef: AngularFireList<JournalEntry>;
  private members: Observable<Member[]>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public db: AngularFireDatabase,
              public formBuilder: FormBuilder,
              private memberService: MemberProvider,
              private entryProvider: EntryProvider,
			  private events: Events) {

    this.entriesRef = db.list('entries');
    this.initForm();
	  this.events.subscribe(SIGNED_IN_USER, () => {
    	this.members = this.memberService.getMembers();
	  });
  }

  initForm() {
    this.journalEntry = this.formBuilder.group({
      amount: ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      concept: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],
      payers: ['', Validators.required],
      commonExpense: ['true', Validators.nullValidator],
      targets: ['', Validators.nullValidator]
    });
    this.journalEntry.validator = (formGroup: FormGroup) => {
      return NewEntryTargetsValidator.validEntryTargets(formGroup);
    };
  }

  createEntry() {
    let entry = new JournalEntry();
    Object.assign(entry, this.journalEntry.value);

    this.entryProvider.create(this.journalEntry.value as JournalEntry)
      .then(() => {
        let newEntryModal = this.alertCtrl.create({
          title: 'New Entry Added',
          message: "The new entry has been added",
          buttons: [
            {
              text: 'OK',
              handler: () => this.initForm()
            }
          ]
        });
        newEntryModal.present(newEntryModal).then(noop);
      });


  }

}
