import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {EntryProvider} from "../../providers/entries/EntryProvider";
import {GroupedEntries} from "../../model/journalEntry";
import {MemberProvider} from "../../providers/members/MemberProvider";
import {AbsPipe} from "../../pipes/abs/abs";

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

	private selectedGroup: GroupedEntries;

	groupedEntries: GroupedEntries[] = [];

	totalPaid: any[];
	totalSpent: any[];
	totalDiffs: any[];

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				private entryProvider: EntryProvider,
				private memberProvider: MemberProvider) {
	}

	ionViewWillEnter() {
		this.entryProvider.getGroupedEntries().subscribe(ges => {
			this.groupedEntries = ges;

			this.selectedGroup = ges[0];
			this.monthChanged();
		});
	}

	monthChanged() {
		console.log(`Month changed to ${this.selectedGroup.key}`);

		this.memberProvider.getMembers().subscribe(members => {
			let membersTotalPayed = new Map<string, number>();
			let membersTotalSpent = new Map<string, number>();

			// prepare computational maps for totals
			members.forEach(m => {
				membersTotalPayed.set(m.$key, 0);
				membersTotalSpent.set(m.$key, 0)
			});

			// process each entry of the selected group
			this.selectedGroup.entries.forEach(entry => {
				// add payment for each payer
				let numOfPayers = entry.payers.length;
				entry.payers.forEach(p => {
					let currentAmount = membersTotalPayed.get(p.$key);

					membersTotalPayed.set(p.$key, currentAmount + (entry.amount * (1 / numOfPayers)));
				});

				// add amount spent per each target
				let numOfTargets = entry.targets.length;
				entry.targets.forEach(t => {
					let currentAmount = membersTotalSpent.get(t.$key);

					membersTotalSpent.set(t.$key, currentAmount + (entry.amount * (1 / numOfTargets)));
				})
			});

			// prepare total payments array
			this.totalPaid = Array.from(membersTotalPayed.entries(), e => ({
				member: members.find(m => m.$key === e[0]),
				totalAmount: e[1]
			}));

			// prepare total spent array
			this.totalSpent = Array.from(membersTotalSpent.entries(), e => ({
				member: members.find(m => m.$key === e[0]),
				totalAmount: e[1]
			}));

			// prepare total diffs array
			this.totalDiffs = members.map(m => {
				let memberPayment = this.totalPaid.find(p => p.member.$key === m.$key);
				let memberSpent = this.totalSpent.find(s => s.member.$key === m.$key);

				return {member: m, totalAmount: memberPayment.totalAmount - memberSpent.totalAmount};
			});
		});
	}

}
