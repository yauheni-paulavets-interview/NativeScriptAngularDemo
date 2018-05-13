import { Component, ElementRef } from '@angular/core';
import { TextView } from "ui/text-view";

@Component({
	selector: 'location-view',
	moduleId: module.id,
	templateUrl: './location-view.component.html',
	styleUrls: ['./location-view.component.css']
})
export class LocationViewComponent {

	comment: string = '';

	constructor() { }

	submit() {
		
	}
}
