/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BingMapService } from './bing-map.service';
import { PlatformConfigurationService, PlatformDateService, PlatformTranslateService } from '@libs/platform/common';
import { MapUtilityService } from './map-utility.service';

describe('BingMapService', () => {
	let service: BingMapService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [PlatformConfigurationService, MapUtilityService, PlatformTranslateService, PlatformDateService],
		});
		service = TestBed.inject(BingMapService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
