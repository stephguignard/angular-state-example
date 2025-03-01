import {Component, computed, effect, OnInit, Signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {User} from '../../models/user';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {Router} from '@angular/router';
import {Button} from 'primeng/button';
import {JsonPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-user-table',
  imports: [
    TableModule,
    Button,
    JsonPipe,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
  users! :Signal<User[]> ;
  page! :Signal<number> ;



  constructor(private userSearchStateService: UserSearchStateService,private router: Router) {
    console.log("📌 Initialisation de UserTableComponent...");

    // effect(() => {
    //   console.log("📌 Liste des utilisateurs mise à jour :", this.users());
    // });
  }

  ngOnInit() {
    this.users = this.userSearchStateService.getUsersSignal();
    this.page = this.userSearchStateService.getPageSignal();

    // ✅ Vérification que `users` change bien

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
    this.router.navigate(['/user', userId]);
  }

}
