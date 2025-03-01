import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {UserSearchComponent} from '../../components/user-search/user-search.component';
import {UserTableComponent} from '../../components/user-table/user-table.component';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-user-search-list-page',
  imports: [
    ReactiveFormsModule,
    UserSearchComponent,
    UserTableComponent,
    Card
  ],
  providers: [UserSearchStateService],
  templateUrl: './user-search-list-page.component.html',
  styleUrl: './user-search-list-page.component.scss'
})
export class UserSearchListPageComponent {

}
