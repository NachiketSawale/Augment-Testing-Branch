/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { UiCommonListSelectionDialogUtilitiesService } from './list-selection-dialog-utilities.service';

describe('ListSelectionDialogUtilitiesService', () => {
	let service: UiCommonListSelectionDialogUtilitiesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UiCommonListSelectionDialogUtilitiesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
