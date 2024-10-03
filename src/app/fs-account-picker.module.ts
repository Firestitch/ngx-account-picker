import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
    declarations: [
        FsAccountPickerComponent,
        FsAccountPickerResultDirective,
    ],
    providers: []
})
export class FsAccountPickerModule {}
