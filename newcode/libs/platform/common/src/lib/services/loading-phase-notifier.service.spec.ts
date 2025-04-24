/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { LoadingPhaseNotifierService } from './loading-phase-notifier.service';

describe('LoadingPhaseNotifierService', () => {
	let service: LoadingPhaseNotifierService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LoadingPhaseNotifierService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
