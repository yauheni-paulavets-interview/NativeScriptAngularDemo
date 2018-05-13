import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Attachment } from '../model';

import { Mediafilepicker, MediaFilepickerOptions } from 'nativescript-mediafilepicker';
import * as fileSystemModule from "tns-core-modules/file-system"
import * as app from 'tns-core-modules/application/application';

//Wraps the File API related logic
@Injectable()
export class FileReaderService {

	constructor() { }

	getFile(parentId) {

		let mediafilepicker: Mediafilepicker = new Mediafilepicker();
		let options: MediaFilepickerOptions = {
			android: {
				mxcount: 2,
				enableImagePicker: true,
				enableVideoPicker: true,
				enableCameraSupport: true,
			},
			ios: {
				allowsMultipleSelection: false,
				title: "Album",
				showCameraButton: false,
			}
		};

		let observ = Observable.create((observer) => {
			mediafilepicker.on("getFiles", (res: any) => {

				let files = res.files;
				if (files.length > 0) {
					files = files.split(",");
					files.forEach(file => {
						let target: any = fileSystemModule.File.fromPath(file);
						let base64content = target.readSync().base64EncodedStringWithOptions(0);
						let newAttach = new Attachment({
							isProcessing: true,
							attachment: {
								Body: base64content,
								ParentId: parentId,
								Name: target._name,
								IsPrivate: false,
								ContentType: target._extension.replace(/\./, '').toLowerCase()
							}
						});
						observer.next(newAttach);
					});
				} else {
					console.log("There was some problem to select the file. Looks like user has cancel it.")
				}
	
			})
		});
		mediafilepicker.startFilePicker(options);

		return observ;
	}
}
