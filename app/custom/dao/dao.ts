import { Inject } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map, catchError, share } from 'rxjs/operators';
import { pipe } from 'rxjs/Rx';

//Handles rest based crud opearions
//Inherited by location/attachment services within the same dir
export abstract class Dao {

	protected newUpdateRecordsSource: Subject<any> = new Subject<any>();
	protected allRecordsSource: ReplaySubject<any[]> = new ReplaySubject<any[]>();
	protected deleteRecordsSource: Subject<any> = new Subject<any>();

	//list/map components listen to the operations completion
	newUpdateRecords$ = this.newUpdateRecordsSource.asObservable();
	allRecords$ = this.allRecordsSource.asObservable();
	deleteRecords$ = this.deleteRecordsSource.asObservable();

	constructor(protected http: Http,
		protected destinationUrl: string) { }

	abstract buildModelInstance(jsonRecord);

	getAll(emit: boolean = false): Observable<any[]> {

		let mapResponseToJson = map((res: Response) => {

			return res.json()
		});
		let mapJsonToModel = map((data: any[]) => {
			let records = [];
			data.forEach((record) => {
				records.push(this.buildModelInstance(record));
			});
			return records;
		});

		let catchSmh = catchError((data: any) => {
			return [];
		});
		let allRecordsObservable = this.http.get(this.destinationUrl, {
			headers: this.getCommonHeaders()
		})
			.pipe(
				mapResponseToJson,
				mapJsonToModel,
				catchSmh,
				share()
			);

		if (emit) {
			allRecordsObservable.subscribe((records) => this.emitAllRecords(records), () => console.log('Get all failed'));
		}
		return allRecordsObservable;
	}

	private emitAllRecords(allRecords: any[]) {
		this.allRecordsSource.next(allRecords);
	}

	insertUpdate(recordToBeHandled, emit: boolean = false): Observable<any> {

		let mapResponseToJson = map((res: Response) => res.json());
		let mapJsonToModel = map(data => {
			return this.buildModelInstance(data);
		});

		let newDirtyRecordObservable = this.http[recordToBeHandled.Id ? "put" : "post"](
			this.destinationUrl,
			JSON.stringify(recordToBeHandled),
			{ headers: this.getCommonHeaders() }
		)
			.pipe(
				mapResponseToJson,
				mapJsonToModel,
				share()
			);

		if (emit) {
			newDirtyRecordObservable.subscribe(
				(record) => {
					this.emitUpdateNewRecord(record);
				},
				() => console.log('Insert failed', recordToBeHandled)
			);
		}

		return newDirtyRecordObservable;
	}

	protected emitUpdateNewRecord(newRecord) {
		this.newUpdateRecordsSource.next(newRecord);
	}

	delete(recordToBeDeleted, emit: boolean = false): Observable<any> {

		let deleteRecordObservable = this.http.delete(
			this.destinationUrl + "/" + recordToBeDeleted.Id,
			{ headers: this.getCommonHeaders() }
		).pipe(share());

		if (emit) {
			deleteRecordObservable.subscribe(() => this.emitDeleteRecord(recordToBeDeleted.Id), () => console.log('Deletion failed', recordToBeDeleted));
		}

		return deleteRecordObservable;
	}

	private emitDeleteRecord(deletedRecordId) {
		this.deleteRecordsSource.next(deletedRecordId);
	}

	getCommonHeaders() {
		let headers = new Headers();
		headers.append("Content-Type", "application/json");
		return headers;
	}
}