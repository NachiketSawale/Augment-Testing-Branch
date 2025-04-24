/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OpenstreetMapService } from './openstreet-map.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { MapUtilityService } from './map-utility.service';

describe('OpenstreetMapService', () => {
	let service: OpenstreetMapService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [MapUtilityService, PlatformTranslateService],
		});
		service = TestBed.inject(OpenstreetMapService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
