import { Component } from '@angular/core';
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";

import { FilterLocationService } from '../../services';

@Component({
	selector: 'filter',
	moduleId: module.id,
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.css']
})
export class FilterComponent {

	myItems: Array<SegmentedBarItem> = [];
	selectedIndex = 0;
	filter = {
		name__c: "",
		comment__c: ""
	};
	visibleInput = {
		0: true,
		1: false
	}

	constructor(private filterLocationService: FilterLocationService) { 
		let item = new SegmentedBarItem();
		item.title = 'Filter By Name';
		this.myItems.push(item);
		item = new SegmentedBarItem();
		item.title = 'Filter By Comment';
		this.myItems.push(item);
	}

	onSelectedIndexChange(args) {
		let segmetedBar = <SegmentedBar>args.object;
		for (let key in this.visibleInput) {
			this.visibleInput[key] = false;
		}

		this.visibleInput[segmetedBar.selectedIndex] = true;
		this.selectedIndex = segmetedBar.selectedIndex;
	}

	onFilterValueChange(args) {
		this.filterLocationService.pushNewFilterValue(this.filter);
	}
}
