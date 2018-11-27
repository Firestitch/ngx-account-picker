import { Component, ViewChild, ElementRef, TemplateRef, ContentChild, Input, OnInit } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material'

import { isObject, remove } from 'lodash';

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

  @Input() public validateKeyword = keyword => {
    return email(keyword);
  };

  public searchData: any[] = [];
  public keyword: string = null;
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
  }

  public loadSearchData($event: any): void {
    this.searchData = [];

    if (!$event) {
      return;
    }

    const query = {
      keyword: $event,
      page: 1,
      limit: 10
    };

    if (!isObject($event)) {
      this.search(query)
        .subscribe(response => {
          const selectedIds = list(this._model, this.indexField);
          this.searchData = filter(response, item => {
            return selectedIds.indexOf(item[this.indexField]) === -1;
          });
        });
    } else {
      this.onSelected($event);
    }
  }

  public onSelected(data) {
    this.writeValue([...this._model, data]);
    this.searchInput.nativeElement.value = '';
    this.keyword = '';
  }

  public onRemove(data): void {
    remove(this._model, { [this.keywordField]: data[this.keywordField] });
    this.writeValue(this._model, true);
  }

  public onKeyUp(event) {
    if (event.keyCode !== 13) {
      return;
    }

    let data = filter(this.searchData, { [this.keywordField]: this.keyword });
    data = data && data.length ? data[0] : { [this.indexField]: null, [this.keywordField]: this.keyword };

    if (this.validateKeyword((data[this.keywordField]))) {
      this.onSelected(data);
      this.autocompleteTrigger.closePanel();
    }
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
