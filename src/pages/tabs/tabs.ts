import { Component } from '@angular/core';

import { JournalPage } from '../journal/journal';
import { ContactPage } from '../contact/contact';
import { AddEntryPage } from '../add-entry/add-entry';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AddEntryPage;
  tab2Root = JournalPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
