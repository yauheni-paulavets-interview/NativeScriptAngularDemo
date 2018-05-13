import { Injectable, Inject } from '@angular/core';
import { Http, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { map, catchError, share } from 'rxjs/operators';
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
				records.push(this.buildModelInstance({attachment: record}));
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
}
