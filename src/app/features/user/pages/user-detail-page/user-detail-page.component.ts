import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDetailStateService} from '../../services/user-detail-state.service';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-user-detail-page',
  imports: [
    ReactiveFormsModule,
    Button
  ],
  providers: [UserDetailStateService],
  templateUrl: './user-detail-page.component.html',
  styleUrl: './user-detail-page.component.scss'
})
export class UserDetailPageComponent {
  userForm!: FormGroup;
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userState: UserDetailStateService
  ) {}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userState.loadUser(this.userId);

    const user = this.userState.getSelectedUser();
    if (!user) {
      this.router.navigate(['/user']);
      return;
    }

    this.userForm = this.fb.group({
      name: [user.name, Validators.required],
      firstName: [user.firstName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
    });
  }

  saveChanges() {
    if (this.userForm.valid) {
      this.userState.updateUser({ id: this.userId, ...this.userForm.value });
      this.router.navigate(['/user']);
    }
  }

  cancel() {
    this.router.navigate(['/user']);
  }
}
