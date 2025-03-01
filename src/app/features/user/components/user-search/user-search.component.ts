import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserSearchStateService} from '../../services/user-search-state.service';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-user-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    InputText,
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss'
})
export class UserSearchComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private userSearchStateService: UserSearchStateService) {
    this.searchForm = this.fb.group({
      name: [''],
      firstName: [''],
      email: ['']
    });
  }

  ngOnInit() {
    this.searchForm.patchValue(this.userSearchStateService.getQuerySignal()(), { emitEvent: false });

    // this.searchForm.valueChanges.subscribe(query => {
    //   this.userSearchStateService.setQuery(query);
    // });
  }

  onSearch() {
    this.userSearchStateService.setQuery(this.searchForm.value);
  }
}
