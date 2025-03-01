import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {User} from '../../models/user';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {Router} from '@angular/router';
import {NgForOf} from '@angular/common';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-user-table',
  imports: [
    TableModule,
    Button
  ],
  providers: [UserSearchStateService],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent  {
  constructor(private userSearchStateService: UserSearchStateService, private router: Router) {}

  get users() {
    return this.userSearchStateService.getUsers();
  }

  get page() {
    return this.userSearchStateService.getPage();
  }

  nextPage() {
    this.userSearchStateService.setPage(this.page + 1);
  }

  prevPage() {
    if (this.page > 1) this.userSearchStateService.setPage(this.page - 1);
  }

  editUser(user: User) {
    this.router.navigate(['/user', user.id]);
  }

}
