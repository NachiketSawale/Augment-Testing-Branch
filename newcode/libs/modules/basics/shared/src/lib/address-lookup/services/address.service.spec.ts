/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { BasicsSharedAddressService } from './address.service';

describe('BasicsSharedAddressService', () => {
	let service: BasicsSharedAddressService<object>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule
			]
		});
		service = TestBed.inject(BasicsSharedAddressService<object>);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
