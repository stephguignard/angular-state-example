import {Component, computed, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {UserSearchComponent} from '../../components/user-search/user-search.component';
import {UserTableComponent} from '../../components/user-table/user-table.component';
import {Card} from 'primeng/card';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {Subject, takeUntil} from 'rxjs';

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
export class UserSearchListPageComponent implements OnDestroy{
  private destroy$ = new Subject<void>();

  constructor(
    private userSearchStateService: UserSearchStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Sync URL to State
    this.setRouteSubscription(this.route)
    // Sync State to URL
    this.updateQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setRouteSubscription(route: ActivatedRoute) {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      console.log('Params changés subscribe:', params);
      const query = {
        name: params['name'] || '',
        firstName: params['firstName'] || '',
        email: params['email'] || '',
      };
      const page = Number(params['page']) || 1;

      if (Object.keys(params).length===0){
        this.router.navigate([], {
          queryParams: { ...query, page },
          queryParamsHandling: 'merge'
        });
      }else{
        this.userSearchStateService.setFilters(query,page);
      }
    });
  }

  private updateQueryParams() {
    effect(() => {
      const query = this.userSearchStateService.getQuerySignal()();
      const page = this.userSearchStateService.getPageSignal()();

      //console.log('currentState :',this.currentState());

      this.router.navigate([], {
        queryParams: { ...query, page },
        queryParamsHandling: 'merge'
      });
    });

  }

  onUserEdit(userId: number) {
    this.router.navigate(['/user', userId]);
  }
}
