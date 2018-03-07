import {Component, ViewChild} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {FBJournalEntry, JournalEntry} from "../../model/journalEntry";
import {FormGroup} from "@angular/forms";
import {EntryProvider} from "../../providers/entries/EntryProvider";
import {noop} from "rxjs/util/noop";
import {EntryDataFormComponent} from "../../components/entry-data-form/entry-data-form";

@Component({
	selector: 'page-add-entry',
	templateUrl: 'add-entry.html'
})
export class AddEntryPage {

	@ViewChild(EntryDataFormComponent) entryDataForm: EntryDataFormComponent;

	formAction = (form: FormGroup) => this.createEntry(form);

	constructor(public alertCtrl: AlertController,
				private entryProvider: EntryProvider) {
	}

	ionViewDidEnter(){
		this.entryDataForm.initForm(new JournalEntry());
	}

	createEntry(formGroup: FormGroup) {
		this.entryProvider.create(FBJournalEntry.fromObject(formGroup.value))
			.then(() => {
				let newEntryModal = this.alertCtrl.create({
					title: 'New Entry Added',
					message: "The new entry has been added",
					buttons: [
						{
							text: 'OK',
							handler: () => this.entryDataForm.initForm(new JournalEntry())
						}
					]
				});
				newEntryModal.present(newEntryModal).then(noop);
			});
	}

}
