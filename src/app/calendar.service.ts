import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  getToday() {
    let today = new Date();
    return today.getDate();
  }
}
