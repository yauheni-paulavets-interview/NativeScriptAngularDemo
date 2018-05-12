import { Inject } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { pipe } from 'rxjs/Rx';

//Handles rest based crud opearions
//Inherited by location/attachment services within the same dir
export abstract class Dao {

    protected newRecordsSource: Subject<any> = new Subject<any>();
    protected updateRecordsSource: Subject<any> = new Subject<any>();
    protected allRecordsSource: ReplaySubject<any[]> = new ReplaySubject<any[]>();
    protected deleteRecordsSource: Subject<any> = new Subject<any>();

    //list/map components listen to the operations completion
    newRecords$ = this.newRecordsSource.asObservable();
    updateRecords$ = this.updateRecordsSource.asObservable();
    allRecords$ = this.allRecordsSource.asObservable();
    deleteRecords$ = this.deleteRecordsSource.asObservable();

    constructor(protected http: Http,
                protected destinationUrl: string) {}

    abstract buildModelInstance(jsonRecord);

    getAll(emit: boolean = false): Observable<any[]> {

        let mapResponseToJson = map((res:Response) => {

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
            catchSmh
        );

        if (emit) {
            allRecordsObservable.subscribe((records) => this.emitAllRecords(records), () => console.log('Get all failed'));
        }
        return allRecordsObservable;
    }

    private emitAllRecords(allRecords: any[]) {
        this.allRecordsSource.next(allRecords);
    }

    insertUpdate(record, emit: boolean = false): Observable<any> {

        let mapResponseToJson = map((res:Response) => res.json());
        let mapJsonToModel = map(data => {
            return this.buildModelInstance(data);
        });

        let newDirtyRecordObservable = this.http[record.Id ? "put" : "post"](
            this.destinationUrl,
            JSON.stringify(record),
            { headers: this.getCommonHeaders() }
        )
        .pipe(
            mapResponseToJson,
            mapJsonToModel
        );

        if (emit) {
            newDirtyRecordObservable.subscribe(
                (record) => {
                    if (record.Id) {
                        this.emitUpdateRecord(record);
                    } else {
                        this.emitNewRecord(record);
                    }
                }, 
                () => console.log('Insert failed', record)
            );
        }

        return newDirtyRecordObservable;
    }

    protected emitNewRecord(newRecord) {
        this.newRecordsSource.next(newRecord);
    }

    private emitUpdateRecord(updatedRecord) {
        this.updateRecordsSource.next(updatedRecord);
    }

    delete(recordToBeDeleted, emit: boolean = false): Observable<any> {

        let deleteRecordObservable = this.http.delete(
            this.destinationUrl + "/" + recordToBeDeleted.Id,
            { headers: this.getCommonHeaders() }
        );

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