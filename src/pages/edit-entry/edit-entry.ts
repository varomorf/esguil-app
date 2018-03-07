import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {noop} from "rxjs/util/noop";
import {FBJournalEntry, JournalEntry} from "../../model/journalEntry";
import {FormGroup} from "@angular/forms";
import {EntryDataFormComponent} from "../../components/entry-data-form/entry-data-form";
import {EntryProvider} from "../../providers/entries/EntryProvider";

/**
 * Generated class for the EditEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-entry',
  templateUrl: 'edit-entry.html',
})
export class EditEntryPage {

	@ViewChild(EntryDataFormComponent) entryDataForm: EntryDataFormComponent;

	formAction = (form: FormGroup) => this.editEntry(form);

	constructor(public alertCtrl: AlertController,
				private entryProvider: EntryProvider) {
	}

	editEntry(formGroup: FormGroup) {
		this.entryProvider.edit(FBJournalEntry.fromObject(formGroup.value))
			.then(() => {
				let newEntryModal = this.alertCtrl.create({
					title: 'Entry Update',
					message: "The new entry has been updated",
					buttons: [
						{
							text: 'OK'
						}
					]
				});
				newEntryModal.present(newEntryModal).then(noop);
			});
	}

}
