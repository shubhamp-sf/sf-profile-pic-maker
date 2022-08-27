import { Component } from '@angular/core';
import { UploadService, UploadStatus } from './upload.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	title = 'sf-profile-pic-maker';
	constructor(public upload: UploadService) {}

	onImageReady(url: string) {
		this.upload.imageURL = url;
		console.log('handleImage', this.upload.imageURL);
	}
}
