import { Component, ViewChild, Inject, OnInit, OnDestroy } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/delay';

import { Location } from '../../model';

import {
	LocationStorageService
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
export class LocationsMapComponent implements OnDestroy {

	//Component internal Observable
	//To trigger the same recalculation method upon any change
	_locationsSource: Subject<any> = new Subject<any>();
	_locations$ = this._locationsSource.asObservable();

	_modifiedLocationSubscription: Subscription;
	_filterSubscription: Subscription;

	bearing = 0;
	tilt = 0;
	padding = [40, 40, 40, 40];
	mapView: MapView;

	_filter: any = {};
	_isInited: boolean = false;

	constructor(@Inject('DefaultLocation') public defaultLocation,
		@Inject('Zoom') public zoom,
		private locationStorage: LocationStorageService) {

		//New location is provided via the google places input + the related location is persisted in Salesforce
		this.listenToNewLocation();

		//New filter value is provided
		// this.listenToNewFilterValue();

		this._locations$.subscribe(() => {
			this.recalculateFilteredAndBounds();
		});
	}

	ngOnDestroy() {
		this._modifiedLocationSubscription.unsubscribe();
		//this._filterSubscription.unsubscribe();
	}

	listenToNewLocation() {
		this._modifiedLocationSubscription = this.locationStorage.modifications$.subscribe((newLocation) => {
			this._locationsSource.next();
		});
	}

	// private listenToNewFilterValue() {
	//   this.filterSubscription = this.filterLocationService.filterLocation$.subscribe((filterValue) => {
	//     filterValue = filterValue.trim();
	//     this.filterValue = filterValue.toLowerCase();
	//     this.locationsSource.next();
	//   });
	// }


	//Recalculates bounds + filtered locations
	private recalculateFilteredAndBounds() {

		let filteredLocations = [];
		this.mapView.clear();
		if (this._filter.filterField) {
			filteredLocations = this.locationStorage.locations.filter((location) => {
				return location[this._filter.filterField] === this._filter.filterValue;
			});
		} else {
			filteredLocations = this.locationStorage.locations;
		}

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
		if (!this._isInited) {
			this._isInited = true;
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

	onMarkerEvent(args) {
		console.log("Marker Event: '" + args.eventName
			+ "' triggered on: " + args.marker.title
			+ ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
	}

	onCameraChanged(args) {
		console.log("Camera changed: " + JSON.stringify(args.camera));
	}

}
