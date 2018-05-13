import { Inject } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { TokenModel } from "nativescript-ui-autocomplete";

import { Subject } from 'rxjs/Subject';
import { Location } from "~/custom/model";

export class GooglePlacesService {

	locationSelectionSource: Subject<any> = new Subject<any>();
	locationSelections$ = this.locationSelectionSource.asObservable();

	autocompleteVisibilitySource: Subject<any> = new Subject<any>();
	autocompleteVisibility$ = this.autocompleteVisibilitySource.asObservable();

	private lastResults: Array<any>;

	constructor(@Inject('GoogleApiKey') private googleApiKey,
		@Inject('GooglePlacesUrl') private googlePlacesUrl,
		private http: Http) {

	}

	public getAutocompleteHandler() {

		let baseUrl = this.googlePlacesUrl;
		let apiKey = this.googleApiKey;

		let self = this;
		return (text) => {
			var promise = new Promise((resolve, reject) => {
				let encodedText = encodeURIComponent(text);
				this.http.get(`${baseUrl}?address=${encodedText}&key=${apiKey}`)
					.subscribe((response: any) => {

						self.lastResults = response.json().results;
						var items: Array<TokenModel> = new Array();
						self.lastResults.forEach((location) => {
							items.push(new TokenModel(location.formatted_address, null));
						})
						resolve(items);
					}, (e) => {
						reject([]);
					});
			});

			return promise;
		}
	}

	public getLocationByName(locationName: string) {
		let resultItem = this.lastResults.find((item) => item.formatted_address === locationName);

		let locationInst;
		if (resultItem) {
			locationInst = new Location({
				name__c: locationName,
				coordinates__Longitude__s: resultItem.geometry.location.lng,
				coordinates__Latitude__s: resultItem.geometry.location.lat
			});
		}

		return locationInst;
	}
}