import { Injectable } from '@angular/core';
import { Student, ClassDetail } from './student'
import { Students } from './mock-student'
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from 'rxjs/operators';
import {CalendarEvent} from "angular-calendar";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  getUrl = 'http://127.0.0.1:8080/students'; // event
  addUrl = 'http://127.0.0.1:8080/addJson';
  updateUrl = 'http://127.0.0.1:8080/students';
  eventUrl = 'http://127.0.0.1:8080/event'
  getSelectedUrl = 'http://127.0.0.1:8080/studentsSelect';

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
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** DELETE: delete the student from the server */
  deleteStudent(id: number): Observable<Student> {
    const url = `${this.updateUrl}/${id}`;
    return this.http.delete<Student>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  /** GET students whose name contains search term */
  searchStudents(term: string): Observable<Student[]> {
    if (!term.trim()) {
      // if not search term, return empty student array.
      return of([]);
    }
    return this.http.get<Student[]>(`${this.getSelectedUrl}/${term}`).pipe(
      tap(x => x.length ?
        this.log(`found students matching "${term}"`) :
        this.log(`no student matching "${term}"`)),
      catchError(this.handleError<Student[]>('searchStudents', []))
    );
  }

  /** get all events for all students, this is for calendar component*/
  getAllEvents(): Observable<Student> {
    const url = `${this.getUrl}/events`;
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log(`fetched all events`)),
      catchError(this.handleError<Student>(`fetching events`))
    );
  }

  /** get all events for a student, this is for student component, TODO:only for week view? */
  getEvent(id: number): Observable<ClassDetail[]> {
    // For now, assume that a student with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const url = `${this.eventUrl}/${id}`;
    return this.http.get<Student[]>(url).pipe(
      tap(_ => this.log(`fetched events for student id=${id}`)),
      catchError(this.handleError<ClassDetail[]>(`getEvent for student id=${id}`))
    );
  }

  /** TODO: recursive event */
  addEvent(event: ClassDetail){
    this.log(`adding student's event whose name=${event.name}`);
    // JSON.stringify
    return this.http.post(this.addUrl, JSON.stringify(event),
      {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: "text" }).pipe(
      tap(_ => this.log(`added student whose name=${event.name}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  updateEvent(classDetail: ClassDetail): Observable<any> {
    const url = `${this.eventUrl}`;
    return this.http.put(url, JSON.stringify(classDetail),
      {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: "text" }).pipe(
      tap(_ => this.log(`updated class event name=${classDetail.title}`)),
      catchError(this.handleError<any>('updateEvent'))
    );
  }

  /** DELETE: delete the event from the server */
  deleteEvent(event: CalendarEvent): Observable<Student> {
    const url = `${this.eventUrl}/${event.id}/${event.classId}`;

    return this.http.delete<Student>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted class id=${event.classId}`)),
      catchError(this.handleError<Student>('deleteEvent'))
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
