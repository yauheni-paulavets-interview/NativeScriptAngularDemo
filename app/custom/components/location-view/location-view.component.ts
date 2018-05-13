import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TextView } from "ui/text-view";
import { openUrl } from "utils/utils";

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
	LocationDao,
	AttachmentDao
} from '../../dao';

import { Location, Attachment } from '~/custom/model';

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
	areAttachmentsLoading: boolean = true;

	_routeParamsSubscr: Subscription;

	attachments: Array<Attachment> = [];

	constructor(private googlePlacesService: GooglePlacesService,
		private navigationService: NavigationService,
		private locationDao: LocationDao,
		private attachmentDao: AttachmentDao,
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
				if (!params['id']) {
					self.areAttachmentsLoading = false;
				}
				return !!params['id'];
			}),
			switchMap((params) => {
				return Observable.of(this.locationStorageService.getLocationById(params['id']));
			})
		).subscribe((location) => {
			self.persistedLocationInitialState = Object.assign({}, location);
			self.location = Object.assign({}, location);
			self._fetchAttachments(self.location.Id);
		});
	}

	ngOnDestroy() {
		this._routeParamsSubscr.unsubscribe();
	}

	submit() {
		this.isLoading = true;
		if (!this.location.Id) {
			this.googlePlacesService.autocompleteVisibilitySource.next();
		}
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

	delete() {
		this.isLoading = true;
		this.locationDao.delete(this.location, true)
			.subscribe((location) => {
				this.navigationService.back();
				this.isLoading = false;
			}, (error) => {
				this.isLoading = false;
			});
	}

	_fetchAttachments(locationId) {
		this.attachmentDao.getByParentId(locationId)
			.subscribe((attachments) => {
				this.areAttachmentsLoading = false;
				this.attachments = attachments;
			});
	}

	showAttach(url) {
		openUrl(url);
	}

	deleteAttach(attachmentWrapper: Attachment) {
		let oldAttachIndex = this.attachments.findIndex((oldAttachment) => {
			return !oldAttachment.isProcessing && !oldAttachment.errorTakesPlace && attachmentWrapper.attachment.Id === oldAttachment.attachment.Id;
		});

		attachmentWrapper.isProcessing = true;
		this.attachmentDao.delete(attachmentWrapper.attachment)
			.subscribe(
				(attachment) => {
					attachmentWrapper.isProcessing = false;
					this.attachments.splice(oldAttachIndex, 1);
				},
				(error) => {
					attachmentWrapper.isProcessing = false;
					attachmentWrapper.errorTakesPlace = true;
				}
			);
	}
}
