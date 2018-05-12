import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { 
    LocationsListComponent,
    LocationsMapComponent
} from './custom/components';

const routes: Routes = [
    { path: "", redirectTo: "/list", pathMatch: "full" },
	{ path: "list", component: LocationsListComponent },
	{ path: "map", component: LocationsMapComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [LocationsListComponent, LocationsMapComponent];