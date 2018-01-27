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

	private groupedEntries: GroupedEntries[] = [];

	private selectedGroup: GroupedEntries;

	totalPaid: any[];
	totalSpent: any[];
	private totalDiffs: any[];

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				private entryProvider: EntryProvider,
				private memberProvider: MemberProvider) {
	}

	ionViewDidLoad() {
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
			members.forEach(m => membersTotalPayed.set(m.$key, 0));

			let membersTotalSpent = new Map<string, number>();
			members.forEach(m => membersTotalSpent.set(m.$key, 0));

			this.selectedGroup.entries.forEach(e => {
				let numOfPayers = e.payers.length;
				let payingRatio = 1 / numOfPayers;

				e.payers.forEach(p => {
					let currentMemberAmount = membersTotalPayed.get(p.$key);

					membersTotalPayed.set(p.$key, currentMemberAmount + (e.amount * payingRatio));
				});

				let numOfTargets = e.targets.length;
				let targetRatio = 1 / numOfTargets;

				e.targets.forEach(t => {
					let currentMemberAmount = membersTotalSpent.get(t.$key);

					membersTotalSpent.set(t.$key, currentMemberAmount + (e.amount * targetRatio));
				})
			});

			console.log(membersTotalPayed);
			console.log(membersTotalSpent);

			this.totalPaid = Array.from(membersTotalPayed.entries(), e => ({
				member: members.find(m => m.$key === e[0]),
				totalAmount: e[1]
			}));

			this.totalSpent = Array.from(membersTotalSpent.entries(), e => ({
				member: members.find(m => m.$key === e[0]),
				totalAmount: e[1]
			}));

			this.totalDiffs = members.map(m => {
				let memberPayment = this.totalPaid.find(p => p.member.$key === m.$key);
				let memberSpent = this.totalSpent.find(s => s.member.$key === m.$key);

				return {member: m, totalAmount: memberPayment.totalAmount - memberSpent.totalAmount};
			});
		});
	}

}
