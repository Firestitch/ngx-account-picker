import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Provider,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { email, filter } from '@firestitch/common';

import { findIndex, isEqual, isObject, remove } from 'lodash-es';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { FsAccountPickerResultDirective } from '../../directives/account-picker-result/account-picker-result.directive';
import { getAttributeValue } from '../../helpers/get-attribute-value';


export const FS_ACCOUNT_PICKER_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsAccountPickerComponent),
  multi: true
};


@Component({
  selector: 'fs-account-picker',
  templateUrl: './account-picker.component.html',
  styleUrls: [ './account-picker.component.scss' ],
  providers: [FS_ACCOUNT_PICKER_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAccountPickerComponent implements OnInit, OnDestroy {

  @Input() public search = null;

  @Input() public label = '';
  @Input() public nameProperty = 'name';
  @Input() public imageProperty = 'image';
  @Input() public keywordField = 'email';
  @Input() public delay = 300;

  @Input() public validateKeyword = keyword => {
    return email(keyword);
  };
  public isValidKeyword = false;

  public searchData: any[] = [];
  public newData: any = {};

  public keyword: string = null;
  public keyword$ = new Subject<string>();

  private _model: any[] = [];
  private destroy$ = new Subject();

  get model() {
    return this._model;
  }

  @ViewChild('searchInput', { static: true }) public searchInput: ElementRef = null;
  @ViewChild('autocompleteSearch', { static: true }) public autocompleteSearch = null;
  @ViewChild(MatAutocompleteTrigger, { static: true }) public autocompleteTrigger = null;

  @ContentChild(FsAccountPickerResultDirective, { read: TemplateRef, static: false })
  public templateRef: FsAccountPickerResultDirective = null;

  private _onTouched = () => { };
  private _onChange = (value: any) => { };
  public onFocused = (event: any) => { };

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn }


  constructor(private _cdRef: ChangeDetectorRef) { }

  public ngOnInit() {
    this.keyword$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.delay)
      )
      .subscribe(() => {
        this.onKeyUp();
        this._cdRef.markForCheck();
      });

    this.keyword$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.newData = {};

        if (this.validateKeyword(this.keyword)) {
          this.newData = { type: 'email', email: this.keyword };
        }

        this._cdRef.markForCheck();
      });
  }

  public addEmail(email) {
    this._model.push({ type: 'email', email: email });
  }

  public blur() {

    setTimeout(() => {
      if (this.validateKeyword(this.keyword)) {
        this.addEmail(this.keyword);
      }

      this.clearInput();

      this._cdRef.markForCheck();
    });
  }

  public onKeyUp() {
    this.searchData = [];

    if (!this.keyword) {
      return;
    }

    const comma = this.keyword.match(',');
    if (comma) {
      this.keyword.split(',').forEach(email => {
        if (this.validateKeyword(email)) {
          this.addEmail(email.trim());
        }
      });
      return this.clearInput();
    }

    this.search(this.keyword)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(response => {

        this.searchData = response.map(data => {
          return {
            type: 'account',
            account: data,
            name: getAttributeValue(data, this.nameProperty),
            image: getAttributeValue(data, this.imageProperty)
          }
        });

        this.searchData = filter(this.searchData, item => {

          return findIndex(this._model, (model) => {
            return isEqual(model, item);
          }) === -1;

        });

        this._cdRef.markForCheck();
      });
  }

  public onSelect(data) {
    this.searchData = [];

    if (isObject(data)) {

      if (!filter(this._model, data).length) {
        this.writeValue([...this._model, data]);
      }

      this.clearInput();
    }
  }

  public clearInput() {
    this.searchInput.nativeElement.value = '';
    this.keyword = '';
  }

  public onRemove(data): void {
    remove(this._model, data);
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
