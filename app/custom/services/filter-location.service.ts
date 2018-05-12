import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject }    from 'rxjs/ReplaySubject';

//Just the bus between the input and intersted in views(list/map)
@Injectable()
export class FilterLocationService {

  private filterLocationSource: ReplaySubject<any> = new ReplaySubject<any>();
  filterLocation$ = this.filterLocationSource.asObservable();

  constructor() { }

  pushNewFilterValue(filterValue: any) {
    this.filterLocationSource.next(filterValue);
  }
}
