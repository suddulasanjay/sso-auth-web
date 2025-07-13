import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../common/models/security.model';
import { AccountService } from '../../common/services/account.service';
import { StorageService } from '../../common/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class LoginComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);
  private _accountService = inject(AccountService);
  private _storageService = inject(StorageService);
  clientId: string = '';
  redirectUri: string = '';
  responseType: string = '';
  scope: string = '';
  state: string = '';
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((params) => {
      this.clientId = params['client_id'] || '';
      this.redirectUri = params['redirect_uri'] || '';
      this.responseType = params['response_type'] || '';
      this.scope = params['scope'] || '';
      this.state = params['state'] || '';
    });

    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this._storageService.setAuthorizationUrl(this.buildAuthorizeUrl());
  }

  private buildAuthorizeUrl(): string {
    const queryParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scope,
    });

    if (this.state) queryParams.append('state', this.state);

    return `${
      environment.ssoEndPoint
    }connect/authorize?${queryParams.toString()}`;
  }

  signInWithGoogle() {
    const authorizeUrl = this._storageService.getAuthorizationUrl() ?? '';
    const externalLoginUrl = `${
      environment.endpoint
    }authorization/external-login/google?returnUrl=${encodeURIComponent(
      authorizeUrl
    )}`;
    window.location.href = externalLoginUrl;
  }

  signInWithMicrosoft() {
    const authorizeUrl = this._storageService.getAuthorizationUrl() ?? '';
    const externalLoginUrl = `${
      environment.endpoint
    }authorization/external-login/microsoft?returnUrl=${encodeURIComponent(
      authorizeUrl
    )}`;
    window.location.href = externalLoginUrl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = null;
      const { email, password } = this.loginForm.value;
      const loginRequest: LoginRequest = { email, password };
      this._accountService.logIn(loginRequest).subscribe({
        next: (res) => {
          if (res.success) {
            window.location.href =
              this._storageService.getAuthorizationUrl() ?? '';
          }
        },
        error: (err) => {
          if (err.status === 400 || err.status === 404) {
            // Backend sends plain string as error message
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
          }
        },
      });
    }
  }
}
