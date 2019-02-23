import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {Member} from "../../model/member";
import {AngularFireAuth} from "angularfire2/auth";
import {Events, LoadingController} from "ionic-angular";
import {noop} from "rxjs/util/noop";
import {Observable} from "rxjs/Observable";
import {Storage} from "@ionic/storage";

export const SIGNED_IN_USER = 'SIGNED_IN_USER';

@Injectable()
export class CurrentUserProvider {

	private currentUserRef: AngularFireObject<Member>;
	private currentUser: Member;


	public ready = false;

	constructor(private db: AngularFireDatabase,
				private fireAuth: AngularFireAuth,
				private loadingController: LoadingController,
				private events: Events,
				private storage: Storage) {
	}

	public loginUser(username: string, password: string): Observable<boolean> {
		let loading = this.loadingController.create({
			content: 'Signing in'
		});

		return Observable.create(observer => {
			loading.present().then(noop);

			this.fireAuth.auth.signInWithEmailAndPassword(username, password)
				.then(user => {
					//save login credentials for re-logins
					this.storage.set('credentials', {username: username, password: password});

					this.currentUserRef = this.db.object<Member>('/members/' + user.uid);
					this.currentUserRef.valueChanges()
						.subscribe(user => {
							this.currentUser = user;

							this.ready = true;
							this.events.publish(SIGNED_IN_USER, user);

							loading.dismiss().then(noop);

							observer.next(true);
						});
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
