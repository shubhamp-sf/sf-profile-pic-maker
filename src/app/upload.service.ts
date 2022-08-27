import { Injectable } from '@angular/core';

export enum UploadStatus {
	INITIAL,
	PROCESSING,
	COMPLETE,
}

@Injectable({
	providedIn: 'root',
})
export class UploadService {
	readonly UploadStatus = UploadStatus;
	imageURL: string = '';
	status: UploadStatus = UploadStatus.INITIAL;
	constructor() {}
}
