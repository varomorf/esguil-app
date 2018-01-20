import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Member} from "../../model/member";
import {Observable} from "rxjs/Observable";
import {MemberProvider} from "../../providers/members/MemberProvider";

@Component({
	selector: 'members',
	templateUrl: 'members.html'
})
export class MembersPage {

	private members: Observable<Member[]>;

	constructor(public navCtrl: NavController,
				private memberService: MemberProvider) {
		this.members = this.memberService.getMembers();
	}

}
