import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/filter';

import {
	NavigationService
} from '../../services';

@Component({
	selector: 'header',
	moduleId: module.id,
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	_currentView = 'list';
	_currentViewIcon = 'map';

	previousView;
	previousViewIcon;

	view = {
		list: false,
		map: true,
		location: true,
		back: false
	};


	constructor(private router: Router,
		private navigationService: NavigationService) { }

	ngOnInit() {
		this.router.events
			.filter((e) => e instanceof NavigationEnd)
			.subscribe((e: any) => {
				this.previousView = this._currentView;
				this.previousViewIcon = this._currentViewIcon;

				this._currentView = e.url.replace(/^.*\(main\:/, '').replace(/\/\/.*$/, '');
				this._currentViewIcon = this._currentView === 'map' ? 'list' : 'map';
			});

		this.navigationService.request$
			.subscribe((param: any) => {
				this[param.operation](param.data);
			})
	}

	triggerView(visibleView) {
		this._resetView();
		visibleView.forEach(viewItem => this.view[viewItem] = true);
	}

	_resetView() {
		for (let viewItem in this.view) {
			this.view[viewItem] = false;
		}
	}

	back() {
		this.triggerView([this.previousViewIcon, 'location']);
		this.router.navigate(['/root', { outlets: { main: [this.previousView], filterautocomplete: ['filter'] } }]);
	}

	locationUpdate(locationId) {
		this.triggerView(['back']);
		this.router.navigate(['/root', {
			outlets: {
				main: ['location'],
				filterautocomplete: null
			}
		}],
		{
			queryParams: {
				id: locationId
			}
		});
	}
}
