import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { openUrl } from "utils/utils";

import {
	AttachmentDao
} from '../../dao';

import {
	FileReaderService
} from '../../services';

import { Attachment } from '~/custom/model';

@Component({
	selector: 'attachments',
	moduleId: module.id,
	templateUrl: './attachments.component.html',
	styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {

	@Input('locationId') locationId: string;
	areAttachmentsLoading: boolean = true;
	attachments: Array<Attachment> = [];

	constructor(private attachmentDao: AttachmentDao,
		private fileReaderService: FileReaderService,
		private ngZone: NgZone) { }

	ngOnInit() {
		this._fetchAttachments(this.locationId);
	}

	_fetchAttachments(locationId) {
		this.attachmentDao.getByParentId(locationId)
			.subscribe((attachments) => {
				this.areAttachmentsLoading = false;
				this.attachments = attachments;
			});
	}

	showAttach(url) {
		openUrl(url);
	}

	deleteAttach(attachmentWrapper: Attachment) {
		let oldAttachIndex = this.attachments.findIndex((oldAttachment) => {
			return !oldAttachment.isProcessing && !oldAttachment.errorTakesPlace && attachmentWrapper.attachment.Id === oldAttachment.attachment.Id;
		});

		attachmentWrapper.isProcessing = true;
		this.attachmentDao.delete(attachmentWrapper.attachment)
			.subscribe(
				(attachment) => {
					attachmentWrapper.isProcessing = false;
					this.attachments.splice(oldAttachIndex, 1);
				},
				(error) => {
					attachmentWrapper.isProcessing = false;
					attachmentWrapper.errorTakesPlace = true;
				}
			);
	}

	upload() {
		let subscr: Subscription = this.fileReaderService.getFile(this.locationId)
			.subscribe((attachment: Attachment) => {
				subscr.unsubscribe();
				this._handleAttachmentUpload(attachment);
			});
	}

	_handleAttachmentUpload(attachment: Attachment) {
		this.ngZone.run(() => {
			this.attachments.push(attachment);
			this.attachmentDao.insertUpdate(attachment.attachment)
				.subscribe((uploadedAttachment) => {
					this.attachments.splice(this.attachments.length - 1, 1, uploadedAttachment);
				}, (error) => {
					this.attachments.splice(this.attachments.length - 1, 1);
				});
		});
	}
}
