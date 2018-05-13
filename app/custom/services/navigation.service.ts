import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject }    from 'rxjs/ReplaySubject';

//Just the bus between the header and the rest
@Injectable()
export class NavigationService {

  private requestSource: ReplaySubject<any> = new ReplaySubject<any>();
  request$ = this.requestSource.asObservable();

  constructor() { }

  back() {
    this.requestSource.next({operation: "back"});
  }

  locationUpdate(locationId: string) {
    this.requestSource.next({operation: "locationUpdate", data: locationId});
  }
}
