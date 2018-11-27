import { Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsAccountPickerComponent } from '../components/fs-account-picker/fs-account-picker.component';


export const FS_ACCOUNT_PICKER_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsAccountPickerComponent),
  multi: true
};
