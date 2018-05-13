import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import {
	LocationsListComponent,
	LocationsMapComponent,
	RootComponent,
	LocationViewComponent,
	FilterComponent,
	GooglePlacesAutocompleteComponent
} from '../../components';

const routes: Routes = [
	{ path: '', redirectTo: '/root/(filterautocomplete:filter//main:list)', pathMatch: 'full' },
	{
		path: "root", component: RootComponent, children: [
			{ path: "list", component: LocationsListComponent, outlet: 'main', data: { key: "list" }, },
			{ path: "map", component: LocationsMapComponent, outlet: 'main', data: { key: "map" } },
			{ path: "location", component: LocationViewComponent, outlet: 'main', data: { key: "location" } },
			{ path: 'filter', component: FilterComponent, outlet: 'filterautocomplete', data: { key: "filter" } },
			{ path: 'autocomplete', component: GooglePlacesAutocompleteComponent, outlet: 'filterautocomplete' }
		]
	}
];

@NgModule({
	imports: [NativeScriptRouterModule.forRoot(routes)],
	exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
	LocationsListComponent,
	LocationsMapComponent,
	LocationViewComponent,
	RootComponent,
	FilterComponent,
	GooglePlacesAutocompleteComponent
];