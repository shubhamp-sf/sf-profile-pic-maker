import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PFPListComponent } from './pfp-list.component';

describe('PFPListComponent', () => {
	let component: PFPListComponent;
	let fixture: ComponentFixture<PFPListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PFPListComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PFPListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
