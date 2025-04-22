/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { CollectionUtilitiesService } from './collection-utilities.service';

describe('CollectionUtilitiesService', () => {
	let service: CollectionUtilitiesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CollectionUtilitiesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
