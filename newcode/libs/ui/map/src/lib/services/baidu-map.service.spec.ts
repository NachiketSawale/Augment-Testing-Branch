/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BaiduMapService } from './baidu-map.service';
import { MapUtilityService } from './map-utility.service';

describe('BaiduMapService', () => {
	let service: BaiduMapService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [MapUtilityService],
		});
		service = TestBed.inject(BaiduMapService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
