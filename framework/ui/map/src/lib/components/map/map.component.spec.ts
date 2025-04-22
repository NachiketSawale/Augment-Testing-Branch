/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MapComponent } from './map.component';

import { PlatformTranslateService } from '@libs/platform/common';
import { BaiduMapService } from '../../services/baidu-map.service';
import { BingMapService } from '../../services/bing-map.service';
import { GoogleMapService } from '../../services/google-map.service';
import { MapUtilityService } from '../../services/map-utility.service';
import { OpenstreetMapService } from '../../services/openstreet-map.service';

describe('MapComponent', () => {
	let component: MapComponent;
	let fixture: ComponentFixture<MapComponent>;
	let translateService: PlatformTranslateService;
	let google: GoogleMapService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [MapComponent],
			providers: [MapUtilityService, GoogleMapService, BingMapService, OpenstreetMapService, BaiduMapService, PlatformTranslateService],
		}).compileComponents();

		translateService = TestBed.inject(PlatformTranslateService);
		google = TestBed.inject(GoogleMapService);
		fixture = TestBed.createComponent(MapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check the on api load functionality', () => {
		component.ngOnInit();
	});
});
