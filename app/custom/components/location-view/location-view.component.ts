import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TextView } from "ui/text-view";

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import { switchMap, filter } from 'rxjs/operators';

import {
	GooglePlacesService,
	NavigationService,
	LocationStorageService
} from '../../services';

import {
	LocationDao
} from '../../dao';

import { Location } from '~/custom/model';

@Component({
	selector: 'location-view',
	moduleId: module.id,
	templateUrl: './location-view.component.html',
	styleUrls: ['./location-view.component.css']
})
export class LocationViewComponent implements OnInit, OnDestroy {

	persistedLocationInitialState: Location;
	location: Location = new Location({ comment__c: '' });
	isLoading: boolean = false;

	_routeParamsSubscr: Subscription;

	constructor(private googlePlacesService: GooglePlacesService,
		private navigationService: NavigationService,
		private locationDao: LocationDao,
		private locationStorageService: LocationStorageService,
		private route: ActivatedRoute) { }

	ngOnInit() {
		let self = this;
		this.googlePlacesService.locationSelections$
			.subscribe((selectedLocation: Location) => {
				self.location.name__c = selectedLocation.name__c;
				self.location.coordinates__Latitude__s = selectedLocation.coordinates__Latitude__s;
				self.location.coordinates__Longitude__s = selectedLocation.coordinates__Longitude__s;
			});

		this._routeParamsSubscr = this.route.queryParams.pipe(
			filter((params) => {

				return !!params['id'];
			}),
			switchMap((params) => {
				return Observable.of(this.locationStorageService.getLocationById(params['id']));
			})
		).subscribe((location) => {
			self.persistedLocationInitialState = Object.assign({}, location);
			self.location = Object.assign({}, location);
		});
	}

	ngOnDestroy() {
		this._routeParamsSubscr.unsubscribe();
	}

	submit() {
		this.isLoading = true;
		this.locationDao.insertUpdate(this.location, true)
			.subscribe((location) => {
				this.navigationService.back();
				this.isLoading = false;
			}, (error) => {
				this.isLoading = false;
			});
	}

	get submitEnabled() {
		let result = true;
		if (!this.location.name__c ||
			(this.persistedLocationInitialState && this.persistedLocationInitialState.name__c === this.location.name__c && 
				this.persistedLocationInitialState.comment__c === this.location.comment__c)) {
			result = false;
		}
		return result;
	}
}
