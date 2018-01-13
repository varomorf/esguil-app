import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireObject} from "angularfire2/database";
import {Member} from "../../model/member";
import {AngularFireAuth} from "angularfire2/auth";

@Injectable()
export class CurrentUserProvider {

  private currentUserRef: AngularFireObject<Member>;
  public currentUser: Member;

  constructor(private db: AngularFireDatabase,
              private fireAuth: AngularFireAuth) {

    this.fireAuth.auth.signInWithEmailAndPassword("varomorf@gmail.com", "123456")
      .then(user => {
        console.log(user);

        let currentUserUID = user.uid;

        this.currentUserRef = this.db.object<Member>('/members/' + currentUserUID);
        this.currentUserRef.valueChanges()
          .subscribe(user => {
            this.currentUser = user;
          });
      });

  }

}