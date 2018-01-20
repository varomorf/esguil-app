import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {Member} from "../../model/member";
import {AngularFireAuth} from "angularfire2/auth";
import {Events, LoadingController} from "ionic-angular";
import {noop} from "rxjs/util/noop";
import {Observable} from "rxjs/Observable";

export const SIGNED_IN_USER = 'SIGNED_IN_USER'

@Injectable()
export class CurrentUserProvider {

	private currentUserRef: AngularFireObject<Member>;
	private currentUser: Member;

	constructor(private db: AngularFireDatabase,
				private fireAuth: AngularFireAuth,
				private loadingController: LoadingController,
				private events: Events) {
		let loading = this.loadingController.create({
			content: 'Signing in'
		});

		loading.present().then(noop);

		this.fireAuth.auth.signInWithEmailAndPassword("varomorf@gmail.com", "123456")
			.then(user => {
				this.currentUserRef = this.db.object<Member>('/members/' + user.uid);
				this.currentUserRef.valueChanges()
					.subscribe(user => {
						this.currentUser = user;

						this.events.publish(SIGNED_IN_USER, user);

						loading.dismiss().then(noop);
					});
			});
	}

	public getCurrentUser(): Observable<Member> {
		if (this.currentUser) {
			return Observable.of(this.currentUser);
		} else {
			return this.currentUserRef.valueChanges();
		}
	}

}
