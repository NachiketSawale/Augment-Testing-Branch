/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { UiCommonListSelectionDialogService } from './list-selection-dialog.service';

describe('ListSelectionDialogService', () => {
	let service: UiCommonListSelectionDialogService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UiCommonListSelectionDialogService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
