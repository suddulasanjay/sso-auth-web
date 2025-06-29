import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [MatIconModule]
})
export class LoginComponent {

  private _activatedRoute = inject(ActivatedRoute);
  clientId: string = '';
  redirectUri: string = '';
  responseType: string = '';
  scope: string = '';
  state: string = '';

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      this.clientId = params['client_id'] || '';
      this.redirectUri = params['redirect_uri'] || '';
      this.responseType = params['response_type'] || '';
      this.scope = params['scope'] || '';
      this.state = params['state'] || '';
    });
  }

  private buildAuthorizeUrl(): string {
    const queryParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scope,
    });

    if (this.state) queryParams.append('state', this.state);

    return `${environment.ssoEndPoint}connect/authorize?${queryParams.toString()}`;
  }

  signInWithGoogle() {
    const authorizeUrl = this.buildAuthorizeUrl();
    const externalLoginUrl = `${environment.endpoint}authorization/external-login/google?returnUrl=${encodeURIComponent(authorizeUrl)}`;
    window.location.href = externalLoginUrl;
  }

  signInWithMicrosoft() {
    const authorizeUrl = this.buildAuthorizeUrl();
    const externalLoginUrl = `${environment.endpoint}authorization/external-login/microsoft?returnUrl=${encodeURIComponent(authorizeUrl)}`;
    window.location.href = externalLoginUrl;
  }

}
