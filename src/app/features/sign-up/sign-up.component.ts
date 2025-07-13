import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../common/services/account.service';
import { SignupRequest } from '../../common/models/security.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private _accountService = inject(AccountService);
  signupForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  errorMessage = '';

  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const isMatching = password.value === confirmPassword.value;

    if (!isMatching) {
      confirmPassword.setErrors({ notMatching: true });
    } else {
      // Only clear the error if it's the same custom error
      if (confirmPassword.hasError('notMatching')) {
        confirmPassword.setErrors(null);
      }
    }

    return null; // Always return null from group validator if you're setting errors manually
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.loading = true;
    const { firstName, lastName, email, password, confirmPassword } =
      this.signupForm.value;
    const payload: SignupRequest = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    this._accountService.signUp(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage =
          err.error?.message || 'Signup failed. Please try again.';
      },
    });
  }
}
