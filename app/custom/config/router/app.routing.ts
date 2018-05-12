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