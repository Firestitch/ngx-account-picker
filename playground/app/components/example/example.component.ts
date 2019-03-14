import { Component } from '@angular/core';

import { of } from 'rxjs';

import { filter } from '@firestitch/common';


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  public selectedAccounts = [];

  public search = keyword => {
    const accounts: any[] = [
      { name: 'Bob', email: 'bob@gmail.com', id: 1, image: { small: 'https://randomuser.me/api/portraits/men/61.jpg' } },
      { name: 'Ryan', email: 'ryan@gmail.com', id: 2, image: { small: 'https://randomuser.me/api/portraits/men/33.jpg' } },
      { name: 'Jane', email: 'jane@gmail.com', id: 3, image: { small: 'https://randomuser.me/api/portraits/men/44.jpg' } },
      { name: 'Dave', email: 'dave@gmail.com', id: 4, image: { small: 'https://randomuser.me/api/portraits/men/55.jpg' } }
    ];

    return of(filter(accounts, item => {
      return item.email.toLowerCase().match(new RegExp(String(keyword).toLowerCase()));
    }));
  }

}
