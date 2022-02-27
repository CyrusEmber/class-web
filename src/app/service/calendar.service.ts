import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import {ClassDetail, Student} from '../student';
import { MessageService } from "./message.service";
import { format } from "date-fns";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Global} from "../Global";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // url for guest
  eventUrl = Global.generateUrl('guest', 'event');

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private messageService: MessageService,
              private http: HttpClient) {

  }

  private log(message: string) {
    let now: Date = new Date();
    this.messageService.add(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      + ` CalendarService: ${message}`);
  }

  // reset url for different user
  resetUrl(authenticated: boolean) {
    if(authenticated) {
      this.eventUrl = Global.generateUrl('admin', 'event')
    }
  }

  getToday() {
    let today = new Date();
    return today.getDate();
  }

  eventToClassDetail(event: CalendarEvent) : ClassDetail {
    let classDetail: ClassDetail = {name: "default name"}; // TODO why need construct name
    // TODO recursive
    // TODO check validation of id
    if (event.id === null) this.messageService.add("no name input");
    else classDetail.name = String(event.id);
    // if there exists id
    if (event.classId) classDetail.classId = event.classId;

    classDetail.title = event.title;
    classDetail.start = event.start.toISOString(); // toString format
    classDetail._end = event.end?.toISOString();
    classDetail.color = event.color?.primary;
    classDetail.finished = event.finished;
    classDetail.description = event.description;
    classDetail.homework = event.homework;
    return classDetail;
  }

  classDetailToEvent(classDetail: ClassDetail) : CalendarEvent {
    let event : CalendarEvent = { start: new Date(), title: "default title"};
    if (classDetail.start != null && classDetail.title != null)
      event = {start: new Date(classDetail.start), title: classDetail.title};
    else {
      this.log("no title or start date");
      event = {start: new Date(), title: "default title"}
    }

    if (classDetail._end != null) event.end = new Date(classDetail._end);
    if(!event.color?.primary)
    event.color = {
      primary: String(classDetail.color),
      secondary: String(classDetail.color)
    };

    event.id = classDetail.name;
    event.classId = classDetail.classId;
    // property
    // TODO other property set not here
    event.draggable = true;
    event.homework = classDetail.homework;
    event.description = classDetail.description;
    event.finished = classDetail.finished;
    event.modified = false;

    if (event.resizable != null) {
      event.resizable.beforeStart = true;
      event.resizable.afterEnd = true;
    }
    return event;
  }

  classDetailsToEvents(classDetails: ClassDetail[]) : CalendarEvent[] {
    let events: CalendarEvent[] = [];
    for (let i = 0; i < classDetails.length; i++) {
      events.push(this.classDetailToEvent(classDetails[i]))
    }
    return events;
  }

  /** get all events for all students, this is for calendar component*/
  getEvents(): Observable<ClassDetail[]> {
    this.log('fetching students');
    return this.http.get<Student[]>(this.eventUrl).pipe(
      tap(() => this.log('fetched events')),
      catchError(this.handleError<Student[]>('getEvents', [])),
    );
  }

  /** TODO: recursive event, is it doable?*/
  addEvent(event: ClassDetail){
    this.log(`adding student's event whose name=${event.name}`);
    // JSON.stringify
    return this.http.post(this.eventUrl, JSON.stringify(event),
      {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: "text" }).pipe(
      tap(_ => this.log(`added student whose name=${event.name}`)),
      catchError(this.handleError<Student>('addStudent'))
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

  updateEvent(event: ClassDetail): Observable<any> {
    // check if the class exist by checking the classId and update or delete
    // TODO delete bind with delete button
    const url = `${this.eventUrl}`;
    return this.http.put(url, JSON.stringify(event),
      {headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: "text" }).pipe(
      tap(_ => this.log(`updated event = ${event.classId}`)),
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
