/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';

import { DrawingUtilsService } from './drawing-utils.service';

describe('DrawingUtilsService', () => {
	let service: DrawingUtilsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DrawingUtilsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
