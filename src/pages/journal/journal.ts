import {Component} from '@angular/core';
import {AlertController, NavController, ToastController} from 'ionic-angular';
import {GroupedEntries, JournalEntry} from "../../model/journalEntry";
import {EntryProvider} from "../../providers/entries/EntryProvider";

@Component({
	selector: 'page-journal',
	templateUrl: 'journal.html'
})
export class JournalPage {
	groupedEntries: Array<GroupedEntries> = [];

	constructor(public navCtrl: NavController,
				private entryProvider: EntryProvider,
				private alertCtrl: AlertController,
				private toastCtrl: ToastController) {
	}

	public ionViewDidLoad() {
		this.entryProvider.getGroupedEntries()
			.subscribe(groupedEntries => this.groupedEntries = groupedEntries);
	}

	public removeEntry(entry: JournalEntry) {
		this.presentConfirm(() => {
			this.entryProvider.delete(entry).then(() => {
				this.toastCtrl.create({message: 'Entry deleted correctly', duration: 1000}).present();
			});
		})
	}

	private presentConfirm(action: () => void) {
		let alert = this.alertCtrl.create({
			title: 'Confirm deletion',
			message: 'Do you really want to delete this entry?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel'
				},
				{
					text: 'Delete',
					handler: action
				}
			]
		});
		alert.present();
	}

}
