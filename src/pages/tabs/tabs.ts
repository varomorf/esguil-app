import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { AddEntryPage } from '../add-entry/add-entry';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AddEntryPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
