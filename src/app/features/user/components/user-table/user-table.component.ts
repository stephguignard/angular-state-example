import {Component, OnInit, output, Signal} from '@angular/core';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {User} from '../../models/user';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-user-table',
  imports: [
    TableModule,
    Button,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
  userEdited = output<number>()

  users!: Signal<User[]>;
  page!: Signal<number>;
  loading!: Signal<boolean>;

  constructor(private userSearchStateService: UserSearchStateService) {}

  ngOnInit() {
    this.users = this.userSearchStateService.users;
    this.page = this.userSearchStateService.page;
    this.loading = this.userSearchStateService.loading;
  }

  nextPage() {
    this.userSearchStateService.setPage(this.page() + 1);
  }

  prevPage() {
    if (this.page() > 1) {
      this.userSearchStateService.setPage(this.page() - 1);
    }
  }

  editUser(userId: number) {
    this.userEdited.emit(userId);
  }

  onRowSelect(tableRowSelectEvent: TableRowSelectEvent) {
    console.log(tableRowSelectEvent);
  }

}
