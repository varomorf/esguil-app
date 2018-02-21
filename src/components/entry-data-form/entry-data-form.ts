import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewEntryTargetsValidator} from "../../app/entries/validators/newEntryValidator";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {Member} from "../../model/member";
import {SIGNED_IN_USER} from "../../providers/users/CurrentUserProvider";
import {MemberProvider} from "../../providers/members/MemberProvider";
import {Events} from "ionic-angular";

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

	constructor(private formBuilder: FormBuilder,
				private memberService: MemberProvider,
				private events: Events) {
		this.initForm();
		this.events.subscribe(SIGNED_IN_USER, () => {
			this.members = this.memberService.getMembers();
		});
	}

	public initForm() {
		this.journalEntry = this.formBuilder.group({
			amount: ['', Validators.compose([Validators.required, Validators.min(0.01)])],
			concept: ['', Validators.compose([Validators.required])],
			payers: ['', Validators.required],
			commonExpense: [true, Validators.nullValidator],
			targets: ['', Validators.nullValidator],
			date: [moment().toISOString(), Validators.nullValidator]
		});
		this.journalEntry.validator = (formGroup: FormGroup) => {
			return NewEntryTargetsValidator.validEntryTargets(formGroup);
		};
	}

	public executeAction() {
		this.buttonAction(this.journalEntry);
	}

}
