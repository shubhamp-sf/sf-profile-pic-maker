import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class ImgurService {
	private clientId = '546c25a59c58ad7';
	private headers = {
		Authorization: `Client-ID ${this.clientId}`,
	};

	constructor(private http: HttpClient, private notify: ToastrService) {}

	upload(image: File | string) {
		// prepare body
		let formData = new FormData();
		if (typeof image === 'string') {
			let type: 'url' | 'base64' = image.startsWith('http')
				? 'url'
				: 'base64';

			if (type === 'base64') {
				image = image.replace('data:image/png;base64,', '');
			}

			formData.append('type', type);
			formData.append('image', image);
		} else {
			formData.append('image', image, image.name);
		}

		// send and return request
		return this.http
			.post<ImgurSuccessResponse>(this.getEndpoint('UPLOAD'), formData, {
				headers: this.headers,
			})
			.pipe(catchError(this.handleError));
	}

	delete(deleteHash: string) {
		return this.http
			.delete(this.getEndpoint('DELETE', deleteHash), {
				headers: this.headers,
			})
			.pipe(catchError(this.handleError));
	}

	private handleError = (response: HttpErrorResponse) => {
		console.log(response);
		let rawResponse = response.error as ImgurErrorResponse;
		let errorString =
			rawResponse?.data?.error || 'Something went wrong with Imgur.';

		if (typeof errorString !== 'string') {
			errorString = JSON.stringify(errorString);
		}
		if (errorString.length > 80) {
			errorString = errorString.slice(0, 80).concat('...');
		}
		this.notify.error(errorString);
		return throwError(() => new Error(errorString));
	};

	private getEndpoint = (type: 'UPLOAD' | 'DELETE', extra: string = '') => {
		if (type === 'UPLOAD') {
			return 'https://api.imgur.com/3/image';
		}

		if (type === 'DELETE') {
			return `https://api.imgur.com/3/image/${extra}`;
		}

		return '';
	};
}

export interface ImgurSuccessResponse {
	success: true;
	status: 200;
	data: { link: string; deletehash: string };
}
export interface ImgurErrorResponse {
	success: false;
	status: number;
	data: { error: string };
}
export type ImgurReponseType = ImgurSuccessResponse | ImgurErrorResponse;
