/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MapUtilityService } from './map-utility.service';
import { PlatformConfigurationService } from '@libs/platform/common';

describe('MapKeyService', () => {
	let service: MapUtilityService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [PlatformConfigurationService],
		});
		service = TestBed.inject(MapUtilityService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
