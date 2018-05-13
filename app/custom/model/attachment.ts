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

		this.file = config.file;
		this.isProcessing = config.isProcessing;

		if (config.attachment) {
			this.attachment = config.attachment;
		} else {
			this.attachment = {
				Description: (Attachment.counter++) + '',
				ParentId: config.parentId,
				Name: config.file.name,
				IsPrivate: config.IsPrivate,
				ContentType: config.file.type
			};
		}
	}
}