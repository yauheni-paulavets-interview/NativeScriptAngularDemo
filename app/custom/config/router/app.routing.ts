import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import {
	LocationsListComponent,
	LocationsMapComponent,
	RootComponent,
	LocationViewComponent
} from '../../components';

const routes: Routes = [
	{
		path: "", component: RootComponent, children: [
			{ path: "list", component: LocationsListComponent,  data: { key: "list" },  },
			{ path: "map", component: LocationsMapComponent, data: { key: "map" } },
			{ path: "location", component: LocationViewComponent, data: { key: "location" } },
			{ path: "", redirectTo: "/list", pathMatch: "full" }
		]
	}
];
// const routes: Routes = [
// 	{ path: '', redirectTo: '/root/(filter-autocomplete:filter//main:list)', pathMatch: 'full' },
// 	{
// 		path: "root", component: RootComponent, children: [
// 			{ path: "list", component: LocationsListComponent, outlet: 'main', data: { key: "list" }, },
// 			{ path: "map", component: LocationsMapComponent, outlet: 'main', data: { key: "map" } },
// 			{ path: 'filter', component: FilterComponent, outlet: 'filter-autocomplete', data: { key: "filter" } },
// 			{ path: 'autocomplete', component: GooglePlacesAutocompleteComponent, outlet: 'filter-autocomplete' }
// 		]
// 	}
// ];

@NgModule({
	imports: [NativeScriptRouterModule.forRoot(routes)],
	exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
	LocationsListComponent,
	LocationsMapComponent,
	LocationViewComponent,
	RootComponent
];