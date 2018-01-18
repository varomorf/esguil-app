import { Component } from '@angular/core';

import { JournalPage } from '../journal/journal';
import { MembersPage } from '../members/members';
import { AddEntryPage } from '../add-entry/add-entry';
import {TotalsPage} from "../totals/totals";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AddEntryPage;
  tab2Root = JournalPage;
  tab3Root = TotalsPage;
  tab4Root = MembersPage;

  constructor() {

  }
}
