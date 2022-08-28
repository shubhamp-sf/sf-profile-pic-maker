import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RenderPFPService } from '../render-pfp.service';
import { UploadService, UploadStatus } from '../upload.service';
import templates, { Position, Template } from './templates';

@Component({
	selector: 'app-pfp-list',
	templateUrl: './pfp-list.component.html',
	styleUrls: ['./pfp-list.component.css'],
})
export class PFPListComponent implements OnInit {
	readonly templates = templates;
	readonly defaultImageName = 'SF-Profile-Picture.png';

	constructor(
		public upload: UploadService,
		private renderService: RenderPFPService,
		private toastr: ToastrService
	) {}
	@Input() image: string | null = null;

	ngOnInit(): void {}
	download(template: Template) {
		this.renderService
			.getMergedImage(this.upload.imageURL, template)
			.then((url) => {
				let a = document.createElement('a');
				a.href = url;
				a.download = this.defaultImageName;
				a.click();
			});
	}
	getUserImageStyles(position: Partial<Position> = {}) {
		return {
			top: position.top ? `${position.top}%` : '0%',
			left: position.top ? `${position.left}%` : '0%',
		};
	}
}
