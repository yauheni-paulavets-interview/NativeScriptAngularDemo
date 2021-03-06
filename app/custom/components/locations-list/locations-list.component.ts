import { Component, ChangeDetectionStrategy, Inject, OnInit, OnDestroy } from '@angular/core';
const listViewModule = require("tns-core-modules/ui/list-view");

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';

import { Location } from '../../model';

import {
	LocationStorageService,
	FilterLocationService,
	LocationsCommonLogic,
	NavigationService
} from '../../services';

//Material table based location view.
@Component({
	moduleId: module.id,
	selector: 'locations-list',
	templateUrl: './locations-list.component.html',
	styleUrls: ["./locations-list.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsListComponent extends LocationsCommonLogic implements OnInit, OnDestroy {

	_filter: any = {};

	isLoading: boolean = true;

	locations$ = new BehaviorSubject<Location[]>([]);
	_modifiedLocationSubscription: Subscription;
	_filterLocationSubscription: Subscription;

	constructor(@Inject('Zoom') private defaultZoom,
		private locationStorage: LocationStorageService,
		private filterLocationService: FilterLocationService,
		navigationService: NavigationService) {
		super(navigationService);
	}

	ngOnInit() {
		this._initContextRecords();
		//New location is provided via the google places input + the related location is persisted in Salesforce
		this._listenToModifications();
		//New filter value is provided
		this._listenToNewFilterValue();

		this._internalSubscription = this._locations$.subscribe(() => {
			this._recalculateList();
		});
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this._modifiedLocationSubscription.unsubscribe();
		this._filterLocationSubscription.unsubscribe();
	}

	//Pulls the all locations from Salesforce
	//Location storage is shared service between both views to don't execute extra server-trips
	_initContextRecords() {
		let allLocationsSubscription = this.locationStorage.getAllLocations()
			.subscribe(
				(locations) => {
					allLocationsSubscription.unsubscribe();
					this.locations$.next(locations);
					this.isLoading = false;
				});
	}

	_listenToModifications() {
		this._modifiedLocationSubscription = this.locationStorage.modifications$.subscribe(() => {
			this._locationsSource.next();
		});
	}

	_listenToNewFilterValue() {
		this._filterLocationSubscription = this.filterLocationService.filterLocation$.subscribe((filter) => {
			if (this.locationStorage.dataFetched) {
				this._filter = filter;
				this._locationsSource.next();
			}
		});
	}

	_recalculateList() {
		let filtered = this.filter(this.locationStorage.locations, this._filter);
		this.locations$.next(filtered);
	}
}
