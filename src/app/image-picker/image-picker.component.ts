import {
	EventEmitter,
	Component,
	OnInit,
	Output,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { BgRemoveService } from '../bg-remove.service';
import { ImgurService } from '../imgur.service';
import { UploadService, UploadStatus } from '../upload.service';

@Component({
	selector: 'app-image-picker',
	templateUrl: './image-picker.component.html',
	styleUrls: ['./image-picker.component.css'],
})
export class ImagePickerComponent implements OnInit {
	imageFile: File | null = null;
	statusCheckInterval = 2500;

	@Output() onImageReady = new EventEmitter<string>();

	constructor(
		public upload: UploadService,
		private imgur: ImgurService,
		private bgRemove: BgRemoveService
	) {}
	ngOnInit(): void {}

	handleUploadClick() {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/png, image/jpeg, image/jpg';

		fileInput.addEventListener('change', () => {
			let files = fileInput.files;

			if (files && files.length > 0) {
				this.uploadImage(files[0]);
			}
		});
		fileInput.click();
	}

	private uploadImage(image: File) {
		this.imageFile = image;

		// upload to imgur
		this.setStatus(UploadStatus.PROCESSING);

		this.imgur.upload(this.imageFile).subscribe({
			next: (value) => {
				this.removeBackground(
					value.data.link,
					this.imageFile!.type,
					(url: string) => {
						// onComplete -> hide spinner and delete uploaded image

						this.setStatus(UploadStatus.COMPLETE);

						this.imgur.delete(value.data.deletehash).subscribe();

						this.imgur.upload(url).subscribe({
							next: (uploadResponse) => {
								this.onImageReady.emit(
									uploadResponse.data.link
								);
							},
						});
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
}
