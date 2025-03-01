import {Component, effect, OnInit, Signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {UserSearchComponent} from '../../components/user-search/user-search.component';
import {UserTableComponent} from '../../components/user-table/user-table.component';
import {Card} from 'primeng/card';
import {ActivatedRoute, Router} from '@angular/router';

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

  constructor(
    private userSearchStateService: UserSearchStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setRouteSubscription(this.route)

    effect(() => {
      this.updateQueryParams();
    });
  }

  private setRouteSubscription(route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      const query = {
        name: params['name'] || '',
        firstName: params['firstName'] || '',
        email: params['email'] || '',
      };
      const page = Number(params['page']) || 1;

      this.userSearchStateService.setQuery(query);
      this.userSearchStateService.setPage(page);
    });
  }

  private updateQueryParams() {
    const query = this.userSearchStateService.getQuerySignal()();
    const page = this.userSearchStateService.getPageSignal()();

    this.router.navigate([], {
      queryParams: { ...query, page },
      queryParamsHandling: 'merge'
    });
  }

  onUserEdit(userId: number) {
    this.router.navigate(['/user', userId]);
  }
}
