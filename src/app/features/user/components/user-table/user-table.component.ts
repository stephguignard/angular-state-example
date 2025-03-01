import {Component, computed, effect, EventEmitter, OnInit, Output, Signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {User} from '../../models/user';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {Button} from 'primeng/button';

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
  users!: Signal<User[]>;
  page!: Signal<number>;

  @Output() userEdited = new EventEmitter<number>(); // ✅ Événement pour notifier le parent

  constructor(private userSearchStateService: UserSearchStateService) {}

  ngOnInit() {
    this.users = this.userSearchStateService.getUsersSignal();
    this.page = this.userSearchStateService.getPageSignal();
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

}
