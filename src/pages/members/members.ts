import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Member} from "../../model/member";
import {Observable} from "rxjs/Observable";
import {MemberService} from "../../app/members/member.service";

@Component({
  selector: 'members',
  templateUrl: 'members.html'
})
export class MembersPage {

  members: Observable<Member[]>;

  constructor(public navCtrl: NavController,
              private memberService: MemberService) {
    this.members = this.memberService.members;
  }

}
