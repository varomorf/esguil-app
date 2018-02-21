import { NgModule } from '@angular/core';
import { EntryDataFormComponent } from './entry-data-form/entry-data-form';
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [EntryDataFormComponent],
	imports: [IonicModule],
	exports: [EntryDataFormComponent]
})
export class ComponentsModule {}
