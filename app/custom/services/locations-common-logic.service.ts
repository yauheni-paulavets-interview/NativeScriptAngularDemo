import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import {
	NavigationService
} from '.';


export class LocationsCommonLogic {

	//Component internal Observable
	//To trigger the same recalculation method upon any change
	protected _locationsSource: Subject<any> = new Subject<any>();
	protected _locations$ = this._locationsSource.asObservable();
	protected _internalSubscription;

	constructor(protected navigationService: NavigationService) {
	}

	//'Or', case-sensitive filter.
	filter(records: Array<any>, filter): Array<any> {
		let filterIsEmpty = true;
		for (let key in filter) {
			if (typeof filter[key] === 'string' && filter[key].length) {
				filterIsEmpty = false;
				break;
			}
		}
		if (filterIsEmpty) {
			return records;
		} else {
			return records.filter((record) => {
				let result = false;
				for (let key in filter) {
					let filterValueTakesPlace = typeof filter[key] === 'string' && filter[key].length;
					let recordValueTakesPlace = typeof record[key] === 'string' && record[key].length;
					if (recordValueTakesPlace && filterValueTakesPlace && record[key].indexOf(filter[key]) > -1) {
						result = true;
						break;
					}
				}
				return result;
			});
		}
	}

	handleSelection(locationId) {
		this.navigationService.locationUpdate(locationId);
	}

	ngOnDestroy() {
		this._internalSubscription.unsubscribe();
	}
}