import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RadAutoCompleteTextViewComponent } from "nativescript-ui-autocomplete/angular";
import { TokenModel, AutoCompleteEventData, RadAutoCompleteTextView } from "nativescript-ui-autocomplete";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Color } from "color";

import {
	GooglePlacesService
} from '../../services';
import { Location } from '~/custom/model';


@Component({
	selector: 'google-places-autocomplete',
	moduleId: module.id,
	templateUrl: './google-places-autocomplete.component.html',
	styleUrls: ['./google-places-autocomplete.component.css']
})
export class GooglePlacesAutocompleteComponent implements OnInit {

	_items: ObservableArray<TokenModel> = new ObservableArray<TokenModel>();
	_lastSelectedLocation: Location;
	_justSelected: boolean = false; 

	@ViewChild('locationAutocomplete') locationAutocomplete: RadAutoCompleteTextViewComponent;

	constructor(private googlePlacesService: GooglePlacesService) {
	}

	ngOnInit() {
		this.locationAutocomplete.autoCompleteTextView.loadSuggestionsAsync = this.googlePlacesService.getAutocompleteHandler();
	}

	get dataItems(): ObservableArray<TokenModel> {
		return this._items;
	}

	handleTextChanged(args) {
		if (this._justSelected) {
			this._justSelected = false;
		} else if (this._lastSelectedLocation) {
			this.googlePlacesService.locationSelectionSource.next(
				this._lastSelectedLocation.name__c === args.text ? this._lastSelectedLocation : new Location({})
			);
		}
	}

	handleAutocomplete(args) {
		this._justSelected = true;
		this._lastSelectedLocation = this.googlePlacesService.getLocationByName(args.text);
		if (this._lastSelectedLocation) {
			this.googlePlacesService.locationSelectionSource.next(this._lastSelectedLocation);
		}
	}
}

	

	