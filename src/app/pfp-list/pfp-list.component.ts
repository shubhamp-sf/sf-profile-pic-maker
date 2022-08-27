import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UploadService, UploadStatus } from '../upload.service';
import templates from './templates';

@Component({
	selector: 'app-pfp-list',
	templateUrl: './pfp-list.component.html',
	styleUrls: ['./pfp-list.component.css'],
})
export class PFPListComponent implements OnInit {
	readonly templates = templates;
	constructor(public upload: UploadService, private toastr: ToastrService) {}
	@Input() image: string | null = null;
	ngOnInit(): void {}
}
