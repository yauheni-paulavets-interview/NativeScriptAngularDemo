import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'header',
	moduleId: module.id,
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	isMapView: boolean = false;
	

	constructor(private router: Router) { }

	triggerMpaListView() {
		// let mainOutlet = this.isMapView ? 'list' : 'map';
		// let outlets = { 
		// 	outlets: { 
		// 		"main": [mainOutlet],
		// 		"filter-autocomplete": ["filter"]
		// 	}
		// };
		// this.router.navigate(["/root", outlets]);
		// this.isMapView = !this.isMapView;
		this.router.navigate(["/" + (this.isMapView ? "list" : "map")]);
		this.isMapView = !this.isMapView;
	}

	ngOnInit() {
	}

}
