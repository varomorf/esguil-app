import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {Member} from "../../model/member";
import {AngularFireAuth} from "angularfire2/auth";
import {Subject} from "rxjs/Subject";
import {LoadingController} from "ionic-angular";
import {noop} from "rxjs/util/noop";

@Injectable()
export class CurrentUserProvider {

  private currentUserRef: AngularFireObject<Member>;
  public currentUser: Member;
  public currentUserObservable: Subject<Member> = new Subject<Member>();

  constructor(private db: AngularFireDatabase,
              private fireAuth: AngularFireAuth,
			  private loadingController: LoadingController) {
	let loading = this.loadingController.create({
		content: 'Signing in'
	});

	loading.present().then(noop);

    this.fireAuth.auth.signInWithEmailAndPassword("varomorf@gmail.com", "123456")
      .then(user => {
        let currentUserUID = user.uid;

        this.currentUserRef = this.db.object<Member>('/members/' + currentUserUID);
        this.currentUserRef.valueChanges()
          .subscribe(user => {
            this.currentUser = user;

            this.currentUserObservable.next(user);

            loading.dismiss().then(noop);
          });
      });

  }

}
