import { Inject } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';
import { NSRouteReuseStrategy } from 'nativescript-angular/router/ns-route-reuse-strategy';

export class CustomRouteReuseStrategy extends NSRouteReuseStrategy {

	storedRouteHandles = new Map<string, DetachedRouteHandle>();

	constructor(location: NSLocationStrategy,
		@Inject('RoutesToCache') private routesToCache: string[]) {
		super(location);
	}

	// Decides if the route should be stored
	shouldDetach(route: ActivatedRouteSnapshot): boolean {
		return this.routesToCache.indexOf(route.data["key"]) > -1;
	}

	//Store the information for the route we're destructing
	store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
		this.storedRouteHandles.set(route.data["key"], handle);
	}

	//Return true if we have a stored route object for the next route
	shouldAttach(route: ActivatedRouteSnapshot): boolean {
		return this.storedRouteHandles.has(route.data["key"]);
	}

	//If we returned true in shouldAttach(), now return the actual route data for restoration
	retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
		return this.storedRouteHandles.get(route.data["key"]);
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
		super.shouldReuseRoute(future, curr);
		return future.routeConfig === curr.routeConfig;
	}
}

// //To be able to preserve the views.
// import { Inject } from '@angular/core';
// import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

// export class CustomReuseStrategy implements RouteReuseStrategy {

//   storedRouteHandles = new Map<string, DetachedRouteHandle>();

//   constructor(@Inject('RoutesToCache') private routesToCache: string[]) {}

//   // Decides if the route should be stored
//   shouldDetach(route: ActivatedRouteSnapshot): boolean {
//      return this.routesToCache.indexOf(route.data["key"]) > -1;
//   }

//   //Store the information for the route we're destructing
//   store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
//      this.storedRouteHandles.set(route.data["key"], handle);
//   }

//   //Return true if we have a stored route object for the next route
//   shouldAttach(route: ActivatedRouteSnapshot): boolean {
//      return this.storedRouteHandles.has(route.data["key"]);
//   }

//   //If we returned true in shouldAttach(), now return the actual route data for restoration
//   retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
//      return this.storedRouteHandles.get(route.data["key"]);
//   }

//   //Reuse the route if we're going to and from the same route
//   shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
//      return future.routeConfig === curr.routeConfig;
//   }
// }