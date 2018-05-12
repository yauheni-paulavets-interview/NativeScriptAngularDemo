import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/filter';

@Component({
	selector: 'header',
	moduleId: module.id,
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	_previousUrl;

	view = {
		list: false,
		map: true,
		location: true,
		back: false
	};


	constructor(private router: Router) { }

	ngOnInit() {
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe((e: any) => {
				this._previousUrl = e.url;
				console.log('!!!!!', this._previousUrl);
			});
	}

	triggerMap() {
		this._resetView()
		this.view.list = true;
		this.view.location = true;
		this.router.navigate(["/map"]);
	}

	triggerList() {
		this._resetView()
		this.view.map = true;
		this.view.location = true;
		this.router.navigate(["/list"]);
	}

	triggerLocation() {
		this._resetView()
		this.view.back = true;
		this.router.navigate(["/location"]);
	}

	triggerBack() {
		this._resetView();
		for (let viewItem in this.view) {
			if (this._previousUrl.indexOf(viewItem) > -1) {
				this.view[viewItem] = true;
				break;
			}
		}
		this.view.location = true;
		this.router.navigate([this._previousUrl]);
	}

	_resetView() {
		for (let viewItem in this.view) {
			this.view[viewItem] = false;
		}
	}
}
