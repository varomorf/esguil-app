import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

import {JournalPage} from '../pages/journal/journal';
import {MembersPage} from '../pages/members/members';
import {AddEntryPage} from '../pages/add-entry/add-entry';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from "angularfire2/auth";
import {MemberProvider} from "../providers/members/MemberProvider";
import {CurrentUserProvider} from "../providers/users/CurrentUserProvider";
import {EntryProvider} from "../providers/entries/EntryProvider";
import {registerLocaleData} from "@angular/common";
import localeEs from '@angular/common/locales/es'
import {TotalsPage} from "../pages/totals/totals";

const firebaseConfig = {
  apiKey: "AIzaSyChRFej31HhtKjvrnCF3zeX6T-M2LLxSps",
  authDomain: "esguil-app.firebaseapp.com",
  databaseURL: "https://esguil-app.firebaseio.com",
  projectId: "esguil-app",
  storageBucket: "esguil-app.appspot.com",
  messagingSenderId: "383069590979"
};

@NgModule({
  declarations: [
    MyApp,
    JournalPage,
    MembersPage,
    AddEntryPage,
    TabsPage,
	TotalsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    JournalPage,
    MembersPage,
    AddEntryPage,
    TabsPage,
    TotalsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MemberProvider,
    CurrentUserProvider,
    EntryProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

registerLocaleData(localeEs);