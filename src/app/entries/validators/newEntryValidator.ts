import {FormControl, FormGroup} from "@angular/forms";

export class NewEntryTargetsValidator {

  static validEntryTargets(formGroup: FormGroup) {
    if(formGroup.controls.commonExpense.value){
      return null;
    } else if (formGroup.controls.targets.value === ''){
      return {'no common expense without target': true}
    }
  }

}
