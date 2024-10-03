import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { FsBadgeModule } from '@firestitch/badge';
import { FsExampleModule } from '@firestitch/example';

import { FsAccountPickerModule } from '@firestitch/account-picker';
import { FsChipModule } from '@firestitch/chip';

import { AppComponent } from './app.component';
import {
  ExampleComponent,
  ExamplesComponent
} from './components';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsBadgeModule,
    FsChipModule,
    FsAccountPickerModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot(),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent
  ],
})
export class PlaygroundModule {
}
