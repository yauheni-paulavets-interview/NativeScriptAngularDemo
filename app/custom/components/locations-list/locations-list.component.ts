import { Component, ChangeDetectionStrategy, Inject, OnInit, OnDestroy } from '@angular/core';
const listViewModule = require("tns-core-modules/ui/list-view");

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';

import { Location } from '../../model';

import {
	LocationStorageService
} from '../../services';

//Material table based location view.
@Component({
	moduleId: module.id,
	selector: 'locations-list',
	templateUrl: './locations-list.component.html',
	styleUrls: ["./locations-list.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsListComponent implements OnInit, OnDestroy {

	isLoading: boolean = true;

	locations$ = new BehaviorSubject<Location[]>([]);
	_modifiedLocationSubscription: Subscription;
	_filterLocationSubscription: Subscription;

	constructor(@Inject('Zoom') private defaultZoom,
		private locationStorage: LocationStorageService) {
	}

	ngOnInit() {
		this.initContextRecords();
		//New location is provided via the google places input + the related location is persisted in Salesforce
		this.listenToModifications();
		//New filter value is provided
		//this.listenToNewFilterValue();
	}

	ngOnDestroy() {
		this._modifiedLocationSubscription.unsubscribe();
		//this._filterLocationSubscription.unsubscribe();
	}

	//Pulls the all locations from Salesforce
	//Location storage is shared service between both views to don't execute extra server-trips
	private initContextRecords() {
		let allLocationsSubscription = this.locationStorage.getAllLocations()
			.subscribe(
				(locations) => {
					allLocationsSubscription.unsubscribe();
					this.locations$.next(locations);
					this.isLoading = false;
				});
	}

	private listenToModifications() {
		this._modifiedLocationSubscription = this.locationStorage.modifications$.subscribe(() => {
			this.locations$.next(this.locationStorage.locations);
		});
	}

	// private listenToNewFilterValue() {
	//   this._filterLocationSubscription = this.filterLocationService.filterLocation$.subscribe((filterValue) => {
	//       filterValue = filterValue.trim();
	//       filterValue = filterValue.toLowerCase();
	//       this.dataSource.filter = filterValue;
	//   });
	// }
}
