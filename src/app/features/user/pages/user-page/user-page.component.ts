import { Component } from '@angular/core';
import {UserSearchComponent} from '../../components/user-search/user-search.component';
import {UserTableComponent} from '../../components/user-table/user-table.component';

@Component({
  selector: 'app-user-page',
  imports: [
    UserSearchComponent,
    UserTableComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {

}
