import {Component, effect, Signal, OnInit, computed, untracked} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSearchStateService } from '../../services/user-search-state.service';
import { UserSearchComponent } from '../../components/user-search/user-search.component';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { Card } from 'primeng/card';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class UserSearchListPageComponent  {
  private queryParams: Signal<Params>;
  //private isSyncingStateToURL = false; // ✅ Flag pour éviter les boucles infinies

  constructor(
    private userSearchStateService: UserSearchStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.queryParams = toSignal(this.route.queryParams, { initialValue: {} });
    // ✅ Chargement initial des données sans double appel
    this.initData();
    // ✅ Synchronisation `State -> URL` avec vérification pour éviter les boucles
    this.syncUrlToState();
    // ✅ Synchronisation `URL -> State`
    this.syncStateToUrl();
  }

  private initData() {
    const initialQuery = this.userSearchStateService.query;
    const initialPage = this.userSearchStateService.page;
    console.log('📌 Load initial data...');
    this.userSearchStateService.setFilters(initialQuery(), initialPage());
  }

  private syncStateToUrl() {
    effect(() => {
      const query = this.userSearchStateService.query();
      const page = this.userSearchStateService.page();

      this.router.navigate([], {
        queryParams: {...query, page},
        queryParamsHandling: 'merge'
      })

    });
  }

  private syncUrlToState() {
    effect(() => {
      const params = this.queryParams();
      console.log('📌 URL Params changed:', params);

      const query = {
        name: params['name'] || '',
        firstName: params['firstName'] || '',
        email: params['email'] || '',
      };
      const page = Number(params['page']) || 1;

      if (JSON.stringify(query) !== JSON.stringify(untracked(this.userSearchStateService.query)) || page !== untracked(this.userSearchStateService.page)) {
        console.log("📡 Update state from URL");
        this.userSearchStateService.setFilters(query, page);
      }
    });
  }


  onUserEdit(userId: number) {
    this.router.navigate(['/user', userId]);
  }
}
