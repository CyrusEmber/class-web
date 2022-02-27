import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { StudentService } from "./student.service";
import { CalendarService } from "./calendar.service";
import { ClassDetail } from "../student";

@Injectable({
  providedIn: 'root'
})
export class ServiceResolverService implements Resolve<ClassDetail[]> {

  constructor(private ss: StudentService,
              private cs: CalendarService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClassDetail[]> | Observable<never> {


    return this.cs.getEvents().pipe(
      take(1),
      mergeMap(events => {
        if (events) {
          return of(events);
        } else { // id not found
          this.router.navigate(['/students']);
          return EMPTY;
        }
      })
    );

  }

  resolve1(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ClassDetail[]> | Observable<never> {
    let id = route.paramMap.get('id')!;

    return this.cs.getEvent(Number(id)).pipe(
      take(1),
      mergeMap(event => {
        if (event) {
          return of(event);
        } else { // id not found
          this.router.navigate(['/students']);
          return EMPTY;
        }
      })
    );
  }
}
