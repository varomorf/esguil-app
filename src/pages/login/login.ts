import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CurrentUserProvider} from "../../providers/users/CurrentUserProvider";
import {TabsPage} from "../tabs/tabs";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	private loginForm: FormGroup;

	constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
				private currentUserProvider: CurrentUserProvider) {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.required])]
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	notFilled() {
		return !this.loginForm.value.username || ! this.loginForm.value.password;
	}

	doLogin() {
		let username = this.loginForm.value.username;
		let password = this.loginForm.value.password;

		this.currentUserProvider.loginUser(username, password).subscribe(() => this.navCtrl.setRoot(TabsPage));
	}

}
