import { Injectable, Inject } from '@angular/core';
import { Http } from "@angular/http";

import { Dao } from './dao';

import { Location } from '../model';

@Injectable()
export class LocationDao extends Dao {

	constructor(http: Http,
		@Inject('BaseUrl') baseUrl) {
		super(http, baseUrl + '/location');
	}

	buildModelInstance(jsonRecord) {
		return new Location(jsonRecord);
	}
}
