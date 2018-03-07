import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewEntryTargetsValidator} from "../../app/entries/validators/newEntryValidator";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {Member} from "../../model/member";
import {CurrentUserProvider, SIGNED_IN_USER} from "../../providers/users/CurrentUserProvider";
import {MemberProvider} from "../../providers/members/MemberProvider";
import {Events, NavParams, ViewController} from "ionic-angular";
import {JournalEntry} from "../../model/journalEntry";

/**
 * Generated class for the EntryDataFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'entry-data-form',
	templateUrl: 'entry-data-form.html'
})
export class EntryDataFormComponent {

	private journalEntry: FormGroup;
	private members: Observable<Member[]>;

	@Input('button-action') buttonAction: (FormGroup) => void;

	private getMembers = () => {
		this.members = this.memberService.getMembers();
	};

	constructor(private viewCtrl: ViewController,
				private navParams: NavParams,
				private formBuilder: FormBuilder,
				private memberService: MemberProvider,
				private currentUser: CurrentUserProvider,
				private events: Events) {
		if (!this.currentUser.ready) {
			this.events.subscribe(SIGNED_IN_USER, this.getMembers);
		} else {
			this.getMembers();
		}

		let entry = this.navParams.get('entry') || new JournalEntry();
		this.initForm(entry);
	}

	public initForm(initData: JournalEntry) {
		this.journalEntry = this.formBuilder.group({
			amount: [initData.amount || '', Validators.compose([Validators.required, Validators.min(0.01)])],
			concept: [initData.concept || '', Validators.compose([Validators.required])],
			payers: [initData.payers.map(p => p.$key) || '', Validators.required],
			commonExpense: [initData.commonExpense, Validators.nullValidator],
			targets: [initData.targets.map(t => t.$key) || '', Validators.nullValidator],
			date: [(moment(initData.date) || moment()).toISOString(), Validators.nullValidator]
		});
		this.journalEntry.validator = (formGroup: FormGroup) => {
			return NewEntryTargetsValidator.validEntryTargets(formGroup);
		};
	}

	public executeAction() {
		this.buttonAction(this.journalEntry);
	}

}
