import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/delay';

import { Location } from '../../model';

import {
	LocationStorageService,
	FilterLocationService,
	LocationsCommonLogic,
	NavigationService
} from '../../services';

// Important - must register MapView plugin in order to use in Angular templates
registerElement('MapView', () => MapView);

declare const GMSCoordinateBounds: any;
declare const GMSCameraUpdate: any;

//Google maps based view
@Component({
	selector: 'app-locations-map',
	moduleId: module.id,
	templateUrl: './locations-map.component.html'
})
export class LocationsMapComponent extends LocationsCommonLogic implements OnDestroy {

	_modifiedLocationSubscription: Subscription;
	_filterSubscription: Subscription;

	bearing = 0;
	tilt = 0;
	padding = [40, 40, 40, 40];
	mapView: MapView;

	_filter: any = {};
	isInited: boolean = false;

	constructor(@Inject('DefaultLocation') public defaultLocation,
		@Inject('Zoom') public zoom,
		private locationStorage: LocationStorageService,
		private filterLocationService: FilterLocationService,
		navigationService: NavigationService) {

		super(navigationService);

		//New location is provided via the google places input + the related location is persisted in Salesforce
		this._listenToNewLocation();
		//New filter value is provided
		this._listenToNewFilterValue();
		this._internalSubscription = this._locations$.subscribe(() => {
			this._recalculateFilteredAndBounds();
		});
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this._modifiedLocationSubscription.unsubscribe();
		this._filterSubscription.unsubscribe();
	}

	_listenToNewLocation() {
		this._modifiedLocationSubscription = this.locationStorage.modifications$.subscribe((newLocation) => {
			this._locationsSource.next();
		});
	}

	_listenToNewFilterValue() {
		this._filterSubscription = this.filterLocationService.filterLocation$.subscribe((filter) => {
			if (this.locationStorage.dataFetched) {
				this._filter = filter;
				this._locationsSource.next();
			}
		});
	}


	//Recalculates bounds + filtered locations
	_recalculateFilteredAndBounds() {

		this.mapView.clear();
		let filteredLocations = this.filter(this.locationStorage.locations, this._filter);

		let bounds = GMSCoordinateBounds.alloc().init();
		filteredLocations.forEach((location) => {
			let position = Position.positionFromLatLng(location.coordinates__Latitude__s, location.coordinates__Longitude__s);
			bounds = bounds.includingCoordinate(position);

			var marker = new Marker();
			marker.position = position;
			marker.title = location.name__c;
			marker.snippet = location.name__c;
			marker.userData = location.Id;
			this.mapView.addMarker(marker);
		});

		let update = GMSCameraUpdate.fitBoundsWithPadding(bounds, 0);
		this.mapView.gMap.moveCamera(update);
	}


	onMapReady(event) {
		//Regardless custom reuse strategy relaunches each trigger.
		if (!this.isInited) {
			this.isInited = true;
			this.mapView = event.object;
			this.locationStorage.getAllLocations()
				//If callback is sync - without dealy markers are not drawn.
				.delay(0)
				.subscribe(
					(locations) => {
						this._locationsSource.next();
					});
		}

	}
}
