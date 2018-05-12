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

	triggerView() {
		this.router.navigate(['/' + (this.isMapView ? 'list' : 'map')]);
		this.isMapView = !this.isMapView;
	}

	ngOnInit() {
	}

}
