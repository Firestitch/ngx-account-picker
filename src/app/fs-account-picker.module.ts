import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatChipsModule,
  MatAutocompleteModule,
  MatIconModule,
  MatFormFieldModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';

import { FsAccountPickerComponent } from './components/fs-account-picker/fs-account-picker.component';
import { FsAccountPickerResultDirective } from './directives/fs-account-picker-result/fs-account-picker-result.directive';


@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule
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
export class FsAccountPickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsAccountPickerModule
    };
  }
}
