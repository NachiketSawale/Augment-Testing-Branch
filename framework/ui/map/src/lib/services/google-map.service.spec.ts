/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GoogleMapService } from './google-map.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { MapUtilityService } from './map-utility.service';

describe('GoogleMapService', () => {
	let service: GoogleMapService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [PlatformTranslateService, MapUtilityService],
		});
		service = TestBed.inject(GoogleMapService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
