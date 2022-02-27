import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {finalize, Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {MessageService} from "./message.service";
import {StudentService} from "./student.service";
import {CalendarService} from "./calendar.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  routerUrl = 'http://192.168.1.2';
  authUrl = this.routerUrl + ':8081/auth';
  authenticated = false;
  credentials = {username: '', password: ''};

  constructor(private http: HttpClient,
              private ms: MessageService,
              private ss: StudentService,
              private cs: CalendarService,) {
  }

  private log(message: string) {
    let now: Date = new Date();
    this.ms.add(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      + ` LoginService: ${message}`);
  }

  authenticate(credentials: any, callback: any) {
    this.credentials = credentials;
    const headers = new HttpHeaders(credentials ? {
      authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});

    this.http.get(this.authUrl, {headers: headers, responseType: "text"}).pipe(
      tap(_ => this.log(`Welcome ${credentials.username}, you have login`)),
      catchError(this.handleError<any>('authenticate')))
      .subscribe(response => {
        if (response) {
          this.authenticated = true;
          this.cs.resetUrl(true);
          this.ss.resetUrl(true);
        } else {
          this.authenticated = false;
        }
        return callback && callback();
      });
  }

  logout() {
    this.http.post('logout', {}).pipe(finalize(() => {
      this.authenticated = false;
      this.log("Logout")
    })).subscribe();
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.ms.add(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };

  }
}


