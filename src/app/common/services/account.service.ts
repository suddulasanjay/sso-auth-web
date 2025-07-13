import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../models/security.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private _http = inject(HttpClient);
  path = 'account/';

  signUp(data: SignupRequest) {
    return this._http.post<SignupResponse>(
      `${environment.endpoint}${this.path}signup`,
      data
    );
  }

  logIn(data: LoginRequest) {
    return this._http.post<LoginResponse>(
      `${environment.endpoint}${this.path}login`,
      data,
      { withCredentials: true }
    );
  }
}
