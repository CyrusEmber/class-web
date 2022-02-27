import { Injectable } from '@angular/core';
import {delay, Observable, of} from "rxjs";
import {tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(  private http: HttpClient,
  private router:Router,) { }
  isLoggedIn = false;
  authenticated = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(() => this.isLoggedIn = true)
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }

/*  logoutPost() {
    this.http.post('logout', {}).finally(() => {
      this.authenticated = false;
      this.router.navigateByUrl('/login');
    }).subscribe();
  }*/ // FIXME
}
