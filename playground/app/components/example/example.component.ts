import { Component } from '@angular/core';

import { of } from 'rxjs';

import { filter } from '@firestitch/common/array';


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  public selectedAccounts = [];

  public search = query => {
    const accounts: any[] = [
      { name: 'Bob', email: 'bob@gmail.com', id: 1 },
      { name: 'Ryan', email: 'ryan@gmail.com', id: 2 },
      { name: 'Jane', email: 'jane@gmail.com', id: 3 },
      { name: 'Dave', email: 'dave@gmail.com', id: 4 }
    ];

    accounts.forEach(item => {
      item.avatar = 'https://randomuser.me/api/portraits/men/' + Math.floor((Math.random() * 99) + 1) + '.jpg';
    });

    return of(filter(accounts, item => {
      return item.email.toLowerCase().match(new RegExp(query.keyword.toLowerCase()));
    }));
  }

}
