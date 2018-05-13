import { Component, OnInit, Input } from '@angular/core';
import { openUrl } from "utils/utils";

import {
	AttachmentDao
} from '../../dao';

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
	@Input('isLocationLoading') isLocationLoading: boolean;
	attachments: Array<Attachment> = [];

	constructor(private attachmentDao: AttachmentDao) { }

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
}
