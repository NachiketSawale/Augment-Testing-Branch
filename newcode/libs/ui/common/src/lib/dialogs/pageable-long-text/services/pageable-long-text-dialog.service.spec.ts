/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';

import { UiCommonPageableLongTextDialogService } from './pageable-long-text-dialog.service';

describe('PageableLongTextDialogService', () => {
	let service: UiCommonPageableLongTextDialogService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UiCommonPageableLongTextDialogService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
