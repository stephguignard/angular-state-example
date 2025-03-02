import {Component, effect, OnInit, Signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDetailStateService} from '../../services/user-detail-state.service';
import {Button} from 'primeng/button';
import {User} from '../../models/user';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-user-detail-page',
  imports: [
    ReactiveFormsModule,
    Button,
    Card,
    InputText
  ],
  providers: [UserDetailStateService],
  templateUrl: './user-detail-page.component.html',
  styleUrl: './user-detail-page.component.scss'
})
export class UserDetailPageComponent implements OnInit {
  userForm!: FormGroup;
  user! : Signal<User|null>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userDetailStateService: UserDetailStateService
  ) {
    this.user = this.userDetailStateService.getSelectedUserSignal()

    effect(() => {
      if(this.user()){
        this.userForm = this.fb.group({
          id: [this.user()!.id],
          name: [this.user()!.name, Validators.required],
          firstName: [this.user()!.firstName, Validators.required],
          email: [this.user()!.email, [Validators.required, Validators.email]]
        });
      }
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userDetailStateService.loadUser(id);
  }

  saveChanges() {
    if (this.userForm.valid) {
      this.userDetailStateService.updateUser({ ...this.user(), ...this.userForm.value });
      this.router.navigate(['/user']);
    }
  }

  remove() {
    this.userDetailStateService.removeUser(this.user()!);
    this.router.navigate(['/user']);
  }

  cancel() {
    this.router.navigate(['/user']);
  }


}
