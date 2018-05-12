//The underscores are Salesforce specific as well.
export class Location {
	Id: string;
	name__c: string;
	comment__c: string;
	coordinates__Longitude__s: number;
	coordinates__Latitude__s: number;
	attributes;

	constructor(config) {

		//Salesforce specific.
		this.attributes = {
			type: 'Location__c'
		};

		this.Id = config.Id;
		this.name__c = config.name__c;
		this.comment__c = config.comment__c;
		this.coordinates__Longitude__s = config.coordinates__Longitude__s;
		this.coordinates__Latitude__s = config.coordinates__Latitude__s;
	}
}