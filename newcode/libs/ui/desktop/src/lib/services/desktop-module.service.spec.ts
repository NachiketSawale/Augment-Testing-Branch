/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { DesktopModuleService } from './desktop-module.service';

describe('DesktopModuleService', () => {
	let service: DesktopModuleService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DesktopModuleService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
