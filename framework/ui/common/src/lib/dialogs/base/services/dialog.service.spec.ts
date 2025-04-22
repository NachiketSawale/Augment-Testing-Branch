import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { UiCommonDialogService } from './dialog.service';

describe('ModalDialogService', () => {
	let service: UiCommonDialogService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [MatDialogModule],
		});
		service = TestBed.inject(UiCommonDialogService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
