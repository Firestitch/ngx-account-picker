import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexModule } from '@angular/flex-layout';

import { FsExampleModule } from '@firestitch/example';
import { FsBadgeModule } from '@firestitch/badge';

import { FsAccountPickerModule } from '@firestitch/account-picker';
import { FsChipModule } from '@firestitch/chip';

import { AppMaterialModule } from './material.module';
import {
ExampleComponent,
ExamplesComponent } from './components';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsBadgeModule,
    FlexModule,
    FsChipModule,
    FsAccountPickerModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
