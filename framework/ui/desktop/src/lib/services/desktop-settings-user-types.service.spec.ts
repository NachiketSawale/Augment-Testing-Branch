/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';

import { DesktopSettingsUserTypesService } from './desktop-settings-user-types.service';

describe('DesktopSettingsUserTypesService', () => {
	let service: DesktopSettingsUserTypesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DesktopSettingsUserTypesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
