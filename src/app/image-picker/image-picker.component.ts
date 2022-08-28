import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { BgRemoveService } from '../bg-remove.service';
import { ImgurService } from '../imgur.service';
import { UploadService, UploadStatus } from '../upload.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { RenderPFPService } from '../render-pfp.service';

@Component({
	selector: 'app-image-picker',
	templateUrl: './image-picker.component.html',
	styleUrls: ['./image-picker.component.css'],
})
export class ImagePickerComponent implements OnInit {
	imageFile: File | null = null;
	statusCheckInterval = 2500;
	croppedImage: string | null = null;

	@Output() onImageReady = new EventEmitter<string>();

	constructor(
		public upload: UploadService,
		private imgur: ImgurService,
		private bgRemove: BgRemoveService,
		private toastr: ToastrService,
		private renderService: RenderPFPService
	) {}
	ngOnInit(): void {}

	handleUploadClick() {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/png, image/jpeg, image/jpg';

		fileInput.addEventListener('change', () => {
			let files = fileInput.files;

			if (files && files.length > 0) {
				let file = files[0];
				console.debug(file);

				if (file.size === 0) {
					this.toastr.error(
						'Selected file seems to be corrupted.',
						'File Size is 0 bytes.'
					);
					return;
				}

				this.loadCropper(file);
			}
		});
		fileInput.click();
	}
	private loadCropper(imageFile: File) {
		this.imageFile = imageFile;
	}
	closePopup(event: MouseEvent) {
		if (
			(event.currentTarget as HTMLDivElement).isSameNode(
				event.target as Node
			)
		) {
			// clicked on backdrop
			this.imageFile = null;
		}
	}
	proceed() {
		let base64 = this.croppedImage;
		if (base64) {
			this.uploadImage(base64);
			this.imageFile = null;
		}
	}

	private uploadImage(base64: string) {
		// upload to imgur
		this.setStatus(UploadStatus.PROCESSING);

		this.imgur.upload(base64).subscribe({
			next: (value) => {
				this.removeBackground(
					value.data.link,
					'image/png',
					(url: string) => {
						// onComplete -> delete uploaded image

						this.imgur.upload(url).subscribe({
							next: (uploadResponse) => {
								this.renderService
									.getBlobURL(
										uploadResponse.data.link,
										'BASE64_URL'
									)
									.then((url) => {
										this.onImageReady.emit(url);
									})
									.finally(() => {
										this.setStatus(UploadStatus.COMPLETE);
									});
							},
						});
						this.imgur.delete(value.data.deletehash).subscribe();
					}
				);
			},
			error: () => {
				this.setStatus(UploadStatus.INITIAL);
			},
		});
	}

	private removeBackground(
		link: string,
		type: string,
		onComplete: (url: string) => void
	) {
		this.bgRemove.execute(link, type).subscribe((response) => {
			console.debug('Background Remove Response', response);

			this.waitUntilCompletes(response.task_id).then((url) => {
				console.debug('Background Remove Done!!', url);
				onComplete(url);
			});
		});
	}

	private waitUntilCompletes = (taskId: string) => {
		return new Promise(async (resolve: (url: string) => void, _) => {
			this.bgRemove.checkStatus(taskId).subscribe(async (response) => {
				if (response.status === 'PENDING') {
					await this.waitFor(this.statusCheckInterval);
					resolve(await this.waitUntilCompletes(taskId));
				} else if (response.status === 'SUCCESS') {
					resolve(response.info.data.url);
				}
			});
		});
	};

	private waitFor = (miliSeconds: number = 0) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve('');
			}, miliSeconds);
		});
	};
	setStatus(status: UploadStatus) {
		this.upload.status = status;
	}

	// cropper properties
	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64 ?? null;
	}
	cropperError(error: any) {
		console.debug('cropperError', error);
		this.imageFile = null;
		this.toastr.error(
			'While loading selected image, please try different image.',
			'An Error Occurred.'
		);
	}
}
