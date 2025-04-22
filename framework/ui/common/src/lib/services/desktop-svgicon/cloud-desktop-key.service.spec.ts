/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { CloudDesktopKeyService } from './cloud-desktop-key.service';

describe('CloudDesktopKeyService', () => {
	let service: CloudDesktopKeyService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CloudDesktopKeyService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
