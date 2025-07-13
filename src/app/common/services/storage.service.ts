import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly _authorizationUrl = 'authorization-url';

  getAuthorizationUrl() {
    return localStorage.getItem(this._authorizationUrl);
  }

  setAuthorizationUrl(url: string) {
    localStorage.setItem(this._authorizationUrl, url);
  }
}
