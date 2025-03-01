import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-user-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss'
})
export class UserSearchComponent implements OnInit {
  searchForm: FormGroup;

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
  }

  ngOnInit() {
    // Charger les paramètres depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.searchForm.patchValue({
        name: params['name'] || '',
        firstName: params['firstName'] || '',
        email: params['email'] || ''
      });
    });
  }

  onSearch() {
    const queryParams = this.searchForm.value;
    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

    this.userSearchState.setQuery(this.searchForm.value);
  }
}
