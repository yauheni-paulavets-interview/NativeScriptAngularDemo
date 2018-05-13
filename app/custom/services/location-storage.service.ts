import { Injectable, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { LocationDao } from '../dao';

import { Location } from '../model';

//The shared service between the both views to don't execute extra server trips(Uses cache based subject)
//Also notifies the views upon a location insertion/deletion
@Injectable()
export class LocationStorageService implements OnDestroy {

	protected modificationsSource: Subject<any> = new Subject<any>();
	modifications$ = this.modificationsSource.asObservable();

	private allRecordsSource: ReplaySubject<any[]> = new ReplaySubject<any[]>();
	private allRecords$ = this.allRecordsSource.asObservable();

	private newRecordsSubscription: Subscription;
	private deletedRecordsSubscription: Subscription;

	private _locations: Location[];
	public dataFetched = false;
	get locations() {
		return this._locations;
	}

	constructor(private locationDao: LocationDao) {
		this.establishListeners();
	}

	ngOnDestroy() {
		this.newRecordsSubscription.unsubscribe();
		this.deletedRecordsSubscription.unsubscribe();
	}

	//to don't execute extra server trips(Uses cache based subject)
	getAllLocations() {
		if (!this._locations) {
			let allLocationsObservable = this.locationDao.getAll();
			allLocationsObservable.subscribe((locations) => {
				this.dataFetched = true;
				this._locations = locations;
				this.allRecordsSource.next(this._locations);
			});
		}

		return this.allRecords$;
	}

	private establishListeners() {
		//Notifies the views upon a location insertion
		this.newRecordsSubscription = this.locationDao.newRecords$.subscribe((newLocation) => {
			this._locations.push(newLocation);
			this.modificationsSource.next();
		});

		//Notifies the views upon a location deletion
		this.deletedRecordsSubscription = this.locationDao.deleteRecords$.subscribe((deletedRecordId) => {
			let index = this._locations.findIndex((location) => location.Id === deletedRecordId);
			this._locations.splice(index, 1);
			this.modificationsSource.next();
		});
	}

	getLocationById(id: string) {
		return this._locations.find((location) => location.Id === id);
	}

}
