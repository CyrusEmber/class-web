import { Injectable } from '@angular/core';
import { Student } from './student'
import { Students } from './mock-student'
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  getUrl = 'http://192.168.0.104:8080/students';
  addUrl = 'http://192.168.0.104:8080/addJson';
  updateUrl = 'http://192.168.0.104:8080/students';
  getSelectedUrl = 'http://192.168.0.104:8080/studentsSelect';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  private log(message: string) {
    let now: Date = new Date();
    this.messageService.add(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      + ` StudentService: ${message}`);
  }

  getStudents(): Observable<Student[]> {
    this.log('fetching students');
    return this.http.get<Student[]>(this.getUrl).pipe( //FIXME tap does not work, only work when there is no error
      tap(() => this.log('fetched students')),
      catchError(this.handleError<Student[]>('getStudents', [])),
    );
  }

  getStudent(id: number): Observable<Student> {
    // For now, assume that a student with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const url = `${this.getUrl}/${id}`;
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log(`fetched student id=${id}`)),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  /** POST: add a new student to the server */
  //FIXME why it is wrong
  addStudent(student: Student): Observable<Student> {
    this.log(`adding student whose name=${student.name}`);
    // JSON.stringify
    return this.http.post<Student>(this.addUrl, JSON.stringify(student), this.httpOptions ).pipe(
      tap((student) => this.log(`added student whose name=${student.name}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  addStudent1(student: Student){
    this.log(`adding student whose name=${student.name}`);
    // JSON.stringify
    return this.http.post(this.addUrl, JSON.stringify(student),
      {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: "text" }).pipe(
      tap(_ => this.log(`added student whose name=${student.name}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  /** PUT: update a specific student on the server */
  updateStudent(student: Student): Observable<any> {
    const url = `${this.updateUrl}/${student.id}`;
    return this.http.put(url, JSON.stringify(student), this.httpOptions).pipe(
      tap(_ => this.log(`updated student name=${student.name}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteStudent(id: number): Observable<Student> {
    const url = `${this.updateUrl}/${id}`;

    return this.http.delete<Student>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  /* GET heroes whose name contains search term */
  searchStudents(term: string): Observable<Student[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Student[]>(`${this.getSelectedUrl}/${term}`).pipe(
      tap(x => x.length ?
        this.log(`found students matching "${term}"`) :
        this.log(`no student matching "${term}"`)),
      catchError(this.handleError<Student[]>('searchStudents', []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
