/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { DesktopLayoutSettingsService } from './desktop-layout-settings.service';

describe('DesktopLayoutSettingsService', () => {
	let service: DesktopLayoutSettingsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DesktopLayoutSettingsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
