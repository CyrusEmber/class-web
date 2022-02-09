export interface Student {
  id?: number;
  name: string;
  grade?: string;
  school?: string;
  age?: number;
  city?: string;
  date?: string;
  payment?: any;
  paymentPerClass?: any;
  classDetail?: ClassDetail[];
}

export interface ClassDetail {
  // need to be transformed to CalendarEvent
  classId?: number; // overall class id in the class_detail table, should be auto generated
  id?: number; // student id in student, should be auto gotten
  name: string; // student name
  start?: string; //FIXME GMT+8
  _end?: string;
  title?: string;
  color?: string;
  description?: string;
  homework?: string;
  recursive?: boolean;
}
