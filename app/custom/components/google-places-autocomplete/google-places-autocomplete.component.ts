import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RadAutoCompleteTextViewComponent } from "nativescript-ui-autocomplete/angular";
import { TokenModel, AutoCompleteEventData, RadAutoCompleteTextView } from "nativescript-ui-autocomplete";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Color } from "color";

import {
	GooglePlacesService
} from '../../services';

declare var UIFont: any;
declare var UIView: any;
declare var CGRectMake: any;
declare var UITextFieldViewMode: any;

@Component({
	selector: 'google-places-autocomplete',
	moduleId: module.id,
	templateUrl: './google-places-autocomplete.component.html',
	styleUrls: ['./google-places-autocomplete.component.css']
})
export class GooglePlacesAutocompleteComponent implements OnInit {

	private _items: ObservableArray<TokenModel> = new ObservableArray<TokenModel>();

	@ViewChild('locationAutocomplete') locationAutocomplete: RadAutoCompleteTextViewComponent;

	constructor(private googlePlacesService: GooglePlacesService) {
	}

	ngOnInit() {
		this.locationAutocomplete.autoCompleteTextView.loadSuggestionsAsync = this.googlePlacesService.getAutocompleteHandler();
	}

	get dataItems(): ObservableArray<TokenModel> {
        return this._items;
	}

	public onAutoCompleteLoad(args: AutoCompleteEventData) {
		//this.locationAutocomplete.autoCompleteTextView.ios.color = new Color("#6C929F").ios;

		// this.locationAutocomplete.autoCompleteTextView.nativeView.backgroundColor = new Color("#301217").ios;

		// this.locationAutocomplete.autoCompleteTextView.suggestionView.ios.backgroundColor = new Color("#301217").ios;

		// this.locationAutocomplete.autoCompleteTextView.nativeView.height = 10; 

        let nativeEditText = this.locationAutocomplete.autoCompleteTextView.nativeView;
        nativeEditText.font = UIFont.fontWithNameSize("FuturaT", 14);
        nativeEditText.leftView = new UIView({ frame: CGRectMake(7,16,7,16) });
        nativeEditText.leftViewMode = UITextFieldViewMode.Always;
	}
}
