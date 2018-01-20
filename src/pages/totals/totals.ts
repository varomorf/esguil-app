import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EntryProvider} from "../../providers/entries/EntryProvider";
import {GroupedEntries} from "../../model/journalEntry";

/**
 * Generated class for the TotalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-totals',
	templateUrl: 'totals.html',
})
export class TotalsPage {

	private groupedEntries: GroupedEntries[] = [];
	private dates: string[] = [];

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				private entryProvider: EntryProvider) {
	}

	ionViewDidLoad() {
		this.entryProvider.getGroupedEntries().subscribe(ges => {
			this.groupedEntries = ges;

			this.dates = [];
			ges.forEach(ge => this.dates.push(ge.key));
		});
	}

}
