import { 
	genericError, 
	baseURL 
} from '../constants';

export class Attachment
{
	static counter = 0;

	file: File;
	attachment;
    isSelected: boolean = false;
	isProcessing: boolean = false;
	errorTakesPlace: boolean = false;
	errorMessage: string = genericError;
	downloadUrl: string = baseURL.replace(/\.com\/.*/, '.com/servlet/servlet.FileDownload?file=');

	constructor(config: any) {

		this.isProcessing = config.isProcessing;

		if (config.attachment) {
			this.attachment = config.attachment;
		} else {
			this.attachment = {
				ParentId: config.ParentId,
				Name: config.Name,
				IsPrivate: config.IsPrivate,
				ContentType: config.ContentType,
				Id: config.Id
			};
		}

		this.attachment.Description = (Attachment.counter++) + '';
	}
}