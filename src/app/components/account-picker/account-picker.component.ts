import {
  Component,
  ViewChild,
  ElementRef,
  TemplateRef,
  ContentChild,
  Input,
  OnInit,
  Provider, forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material'

import { filter, list, email } from '@firestitch/common';

import { isObject, remove } from 'lodash-es';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FsAccountPickerResultDirective } from '../../directives/account-picker-result/account-picker-result.directive';


export const FS_ACCOUNT_PICKER_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsAccountPickerComponent),
  multi: true
};


@Component({
  selector: 'fs-account-picker',
  templateUrl: './account-picker.component.html',
  styleUrls: [ './account-picker.component.scss' ],
  providers: [FS_ACCOUNT_PICKER_ACCESSOR]
})
export class FsAccountPickerComponent implements OnInit {

  @Input() public search = null;

  @Input() public label = '';
  @Input() public indexField = 'id';
  @Input() public keywordField = 'email';
  @Input() public delay = 500;

  @Input() public validateKeyword = keyword => {
    return email(keyword);
  };
  public isValidKeyword = false;
  public isExistData = true;

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
      .pipe(
        debounceTime(this.delay),
        distinctUntilChanged(),
      )
      .subscribe(() => this.onKeyUp());

    this.keyword$
      .subscribe(() => {
        this.isExistData = true;
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

        this.isExistData = !!filter(response, { [this.keywordField]: this.keyword }).length;

        const selectedIds = list(this._model, this.indexField);
        this.searchData = filter(response, item => {
          return selectedIds.indexOf(item[this.indexField]) === -1;
        });
      });
  }

  public onSelect(data) {
    this.searchData = [];

    if (isObject(data)) {

      if (!filter(this._model, { [this.keywordField]: data[this.keywordField] }).length) {
        this.writeValue([...this._model, data]);
      }

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
