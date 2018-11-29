import { Component, ViewChild, ElementRef, TemplateRef, ContentChild, Input, OnInit } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material'

import { isObject, remove } from 'lodash';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { filter, list } from '@firestitch/common/array';
import { email } from '@firestitch/common/validate/email';

import { FS_ACCOUNT_PICKER_ACCESSOR } from '../../value-accessors/fs-account-picker.value-accessor';
import { FsAccountPickerResultDirective } from '../../directives/fs-account-picker-result/fs-account-picker-result.directive';


@Component({
  selector: 'fs-account-picker',
  templateUrl: './fs-account-picker.component.html',
  styleUrls: [ './fs-account-picker.component.scss' ],
  providers: [FS_ACCOUNT_PICKER_ACCESSOR]
})
export class FsAccountPickerComponent implements OnInit {

  @Input() public search = null;

  @Input() public label = 'Email';
  @Input() public indexField = 'id';
  @Input() public keywordField = 'email';
  @Input() public delay = 500;

  @Input() public validateKeyword = keyword => {
    return email(keyword);
  };
  public isValidKeyword = false;

  public searchData: any[] = [];
  public newData: object = null;

  public keyword: string = null;
  public keyword$ = new Subject<string>();

  private _model: any[] = [];

  get model() {
    return this._model;
  }

  @ViewChild('searchInput') public searchInput: ElementRef = null;
  @ViewChild('autocompleteSearch') public autocompleteSearch = null;
  @ViewChild(MatAutocompleteTrigger) public autocompleteTrigger = null;

  @ContentChild(FsAccountPickerResultDirective, { read: TemplateRef })
  public templateRef: FsAccountPickerResultDirective = null;

  private _onTouched = () => { };
  private _onChange = (value: any) => { };
  public onFocused = (event: any) => { };

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor() { }

  public ngOnInit() {
    this.keyword$
      .debounceTime(this.delay)
      .distinctUntilChanged()
      .subscribe(() => this.onKeyUp());

    this.keyword$
      .subscribe(() => {
        this.isValidKeyword = this.validateKeyword(this.keyword);
        this.newData = { [this.indexField]: null, [this.keywordField]: this.keyword };
      });
  }

  public onKeyUp() {
    this.searchData = [];

    if (!this.keyword) {
      return;
    }

    const query = {
      keyword: this.keyword,
      page: 1,
      limit: 10
    };

    this.search(query)
      .subscribe(response => {
        const selectedIds = list(this._model, this.indexField);
        this.searchData = filter(response, item => {
          return selectedIds.indexOf(item[this.indexField]) === -1;
        });
      });
  }

  public onSelect(data) {
    this.searchData = [];

    if (isObject(data)) {
      this.writeValue([...this._model, data]);
      this.searchInput.nativeElement.value = '';
      this.keyword = '';
    }
  }

  public onRemove(data): void {
    remove(this._model, { [this.keywordField]: data[this.keywordField] });
    this.writeValue(this._model, true);
  }

  public writeValue(value: any, allowEmpty = false): void {
    value = Array.isArray(value) ? value : [];

    if (!allowEmpty && !value.length) {
      return;
    }

    this._model = value;

    this._onChange(this._model);
  }

}
