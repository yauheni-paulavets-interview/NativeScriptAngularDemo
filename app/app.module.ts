import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { RouteReuseStrategy } from '@angular/router';
import { NativeScriptUIAutoCompleteTextViewModule } from "nativescript-ui-autocomplete/angular";


import {
	AppRoutingModule,
	CustomRouteReuseStrategy,
	routingComponents
} from "./custom/config/router";

import { AppComponent } from "./app.component";


import {
	googleApiKey,
	zoom,
	genericError,
	defaultLocation,
	baseURL,
	routesToCache,
	googlePlacesUrl
} from './custom/constants';

import {
	LocationDao
} from './custom/dao';

import {
	LocationStorageService,
	FilterLocationService,
	GooglePlacesService
} from './custom/services';

import {
	HeaderComponent,
} from './custom/components';

import * as platform from "platform";
declare var GMSServices: any;

if (platform.isIOS) {
	GMSServices.provideAPIKey(googleApiKey);
}

@NgModule({
	bootstrap: [
		AppComponent
	],
	imports: [
		NativeScriptModule,
		AppRoutingModule,
		NativeScriptHttpModule,
		NativeScriptFormsModule,
		NativeScriptUIAutoCompleteTextViewModule
	],
	declarations: [
		AppComponent,
		HeaderComponent,
		...routingComponents
	],
	providers: [
		LocationDao,
		LocationStorageService,
		FilterLocationService,
		GooglePlacesService,
		{ provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
		{ provide: 'DefaultLocation', useValue: defaultLocation },
		{ provide: 'Zoom', useValue: zoom },
		{ provide: 'BaseUrl', useValue: baseURL },
		{ provide: 'GenericError', useValue: genericError },
		{ provide: 'RoutesToCache', useValue: routesToCache },
		{ provide: 'GoogleApiKey', useValue: googleApiKey },
		{ provide: 'GooglePlacesUrl', useValue: googlePlacesUrl }
	],
	schemas: [
		NO_ERRORS_SCHEMA
	]
})
export class AppModule { }
