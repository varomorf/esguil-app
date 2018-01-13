import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {JournalEntry} from "../../model/journalEntry";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MemberService} from "../../app/members/member.service";
import {Member} from "../../model/member";
import {Observable} from "rxjs/Observable";
import {NewEntryTargetsValidator} from "../../app/entries/validators/newEntryValidator";
import {CurrentUserProvider} from "../../providers/users/CurrentUserProvider";
import {EntryProvider} from "../../providers/entries/EntryProvider";

@Component({
  selector: 'page-add-entry',
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {

  private journalEntry: FormGroup;
  private entriesRef: AngularFireList<JournalEntry>;
  private members: Observable<Member[]>;
  private allMemberIds: Set<string> = new Set<string>();

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public db: AngularFireDatabase,
              public formBuilder: FormBuilder,
              private memberService: MemberService,
              private currentUserProvider: CurrentUserProvider,
              private entryProvider: EntryProvider) {

    this.entriesRef = db.list('entries');
    this.initForm();
    this.members = this.memberService.members;
    this.members.subscribe(data => data.forEach(m => this.allMemberIds.add(m.$key)));
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
    entry.groupId = this.currentUserProvider.currentUser.groupId;
    if (this.journalEntry.value.commonExpense) {
      entry.targets = Array.from(this.allMemberIds);
    }

    this.entryProvider.create(entry)
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
        newEntryModal.present(newEntryModal);
      });


  }

}
