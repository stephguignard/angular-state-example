import {Component, OnInit, Signal, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Button} from 'primeng/button';
import {JsonPipe} from '@angular/common';
import {UserQueryFilter} from '../../models/user-query-filter';

@Component({
  selector: 'app-user-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    JsonPipe
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss'
})
export class UserSearchComponent implements OnInit {
  searchForm: FormGroup;
  query: Signal<UserQueryFilter>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userSearchState: UserSearchStateService
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      firstName: [''],
      email: ['']
    });

    this.query = this.userSearchState.getQuerySignal();
  }

  ngOnInit() {
    // Charger les paramètres depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.searchForm.patchValue({
        name: params['name'] || '',
        firstName: params['firstName'] || '',
        email: params['email'] || ''
      });

      this.userSearchState.setQuery(this.searchForm.value);
    });
  }

  onSearch() {
    const queryParams = this.searchForm.value;
    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

    this.userSearchState.setQuery(this.searchForm.value);
    this.userSearchState.getQuerySignal();
  }
}
