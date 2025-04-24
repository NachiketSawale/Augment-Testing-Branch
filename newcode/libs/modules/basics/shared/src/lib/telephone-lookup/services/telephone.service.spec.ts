/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { BasicsSharedTelephoneService } from './telephone.service';
import { HttpClientModule } from '@angular/common/http';

describe('TelephoneService', () => {
	let service: BasicsSharedTelephoneService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule
			]
		});
		service = TestBed.inject(BasicsSharedTelephoneService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
