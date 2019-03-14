import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatChipsModule,
  MatAutocompleteModule,
  MatIconModule,
  MatFormFieldModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FsBadgeModule } from '@firestitch/badge';

import { FsAccountPickerComponent } from './components/account-picker/account-picker.component';
import { FsAccountPickerResultDirective } from './directives/account-picker-result/account-picker-result.directive';


@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    FsBadgeModule
  ],
  exports: [
    FsAccountPickerComponent,
    FsAccountPickerResultDirective
  ],
  entryComponents: [],
  declarations: [
    FsAccountPickerComponent,
    FsAccountPickerResultDirective,
  ],
  providers: [],
})
export class FsAccountPickerModule {}
