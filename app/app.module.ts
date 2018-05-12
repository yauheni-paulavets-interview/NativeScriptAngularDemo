import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptHttpModule } from "nativescript-angular/http";


import { 
    AppRoutingModule,
    routingComponents
} from "./app.routing";

import { AppComponent } from "./app.component";


import { 
    googleApiKey,
    zoom,
    genericError,
    defaultLocation,
    baseURL
} from './custom/constants';

import {
    LocationDao
} from './custom/dao';

import {
    LocationStorageService
} from './custom/services';

import {
    HeaderComponent
} from './custom/components';

import * as platform from "platform";
declare var GMSServices: any;

if(platform.isIOS) {
    GMSServices.provideAPIKey(googleApiKey);
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        ...routingComponents
    ],
    providers: [
        LocationDao,
        LocationStorageService,
        {provide: 'DefaultLocation', useValue: defaultLocation},
        {provide: 'Zoom', useValue: zoom},
        {provide: 'BaseUrl', useValue: baseURL},
        {provide: 'GenericError', useValue: genericError}
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
