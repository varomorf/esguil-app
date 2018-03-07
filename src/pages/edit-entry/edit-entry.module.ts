import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditEntryPage } from './edit-entry';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    EditEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(EditEntryPage),
	  ComponentsModule
  ],
})
export class EditEntryPageModule {}
