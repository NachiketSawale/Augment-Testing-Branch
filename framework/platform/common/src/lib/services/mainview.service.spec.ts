/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { PlatformCommonMainviewService } from './mainview.service';

describe('PlatformCommonMainviewService', () => {
	let service: PlatformCommonMainviewService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformCommonMainviewService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
