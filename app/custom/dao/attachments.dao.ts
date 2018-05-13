import { Injectable, Inject } from '@angular/core';
import { Http, Response } from "@angular/http";
import * as tnsHttp from "tns-core-modules/http";

import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, catchError, share, } from 'rxjs/operators';
import { pipe } from 'rxjs/Rx';

import { Dao } from './dao';

import { Attachment } from '../model';

@Injectable()
export class AttachmentDao extends Dao {

	constructor(http: Http,
		@Inject('BaseUrl') baseUrl) {
		super(http, baseUrl + '/attachment');
	}

	buildModelInstance(jsonRecord) {
		return new Attachment(jsonRecord);
	}

	getByParentId(parentId: string): Observable<Attachment[]> {
		let mapResponseToJson = map((res: Response) => {
			return res.json();
		});
		let mapJsonToModel = map((data: any[]) => {
			let records = [];
			data.forEach((record) => {
				records.push(this.buildModelInstance({ attachment: record }));
			});
			return records;
		});

		let catchSmh = catchError((data: any) => {
			return [];
		});

		let targetUrl = this.destinationUrl;
		let relatedRecordsObservable = this.http.get(`${targetUrl}?parentId=${parentId}`, {
			headers: this.getCommonHeaders()
		})
			.pipe(
				mapResponseToJson,
				mapJsonToModel,
				catchSmh,
				share()
			);

		relatedRecordsObservable.subscribe((records) => console.log('Get related attachments succeeded'), () => console.log('Get related attachments failed'));

		return relatedRecordsObservable;
	}

	//Native tns http to be able to set timeout.
	insertUpdate(recordToBeHandled, emit: boolean = false): Observable<any> {

		let mapResponseToJson = map((res: tnsHttp.HttpResponse) => { 
			return res.content.toJSON();
		});
		let mapJsonToModel = map(data => {
			return this.buildModelInstance(data);
		});

		let newDirtyRecordObservable = fromPromise(tnsHttp.request({
			url: this.destinationUrl,
			method: recordToBeHandled.Id ? "PUT" : "POST",
			headers: {"Content-Type": "application/json"},
			content: JSON.stringify(recordToBeHandled),
			timeout: 30000
		})).pipe(
			mapResponseToJson,
			mapJsonToModel,
			share()
		);

		if (emit) {
			newDirtyRecordObservable.subscribe(
				(record) => this.emitUpdateNewRecord(record),
				() => console.log('Insert failed', recordToBeHandled)
			);
		}

		return newDirtyRecordObservable;
	}
}
