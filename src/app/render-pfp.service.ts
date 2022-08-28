import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Position, Template } from './pfp-list/templates';

@Injectable({
	providedIn: 'root',
})
export class RenderPFPService {
	constructor(private toastr: ToastrService) {}

	getMergedImage(userImageURL: string, template: Template) {
		return new Promise(async (resolve: (url: string) => void, reject) => {
			let canvas = document.createElement('canvas');
			canvas.width = 1080;
			canvas.height = 1080;
			let ctx = canvas.getContext('2d');

			if (ctx === null) {
				this.toastr.error(
					"2D context doesn't work on your browser.",
					'Failed to download Picture.'
				);
				return;
			}

			let imagesToRender: Array<{
				url: string;
				pos?: Partial<Position>;
			}> = [
				{
					url: template.bg,
				},
				{
					url: userImageURL,
					pos: template.position,
				},
			];

			for (let img of imagesToRender) {
				await this.renderImage(ctx, img.url, img.pos);
			}

			let dataURL = canvas.toDataURL();
			this.getBlobURL(dataURL).then((url: string) => {
				resolve(url);
			});
		});
	}
	getBlobURL(fetchURL: string) {
		return new Promise((resolve: (url: string) => void, reject) => {
			fetch(fetchURL)
				.then((e) => e.blob())
				.then((blob) => {
					resolve(URL.createObjectURL(blob));
				})
				.catch(reject);
		});
	}
	renderImage(
		ctx: CanvasRenderingContext2D,
		url: string,
		pos: Partial<Position> = {}
	) {
		return new Promise((resolve, reject) => {
			const imageObj = new Image();
			this.getBlobURL(url).then((blobURL: string) => {
				imageObj.src = blobURL;

				imageObj.onload = () => {
					ctx!.drawImage(
						imageObj,
						(ctx.canvas.width * (pos.left ?? 0)) / 100,
						(ctx.canvas.height * (pos.top ?? 0)) / 100,
						ctx.canvas.width,
						ctx.canvas.height
					);
					resolve(imageObj);
				};
				imageObj.onerror = () => {
					reject('Failed to load image');
				};
			});
		});
	}
}
