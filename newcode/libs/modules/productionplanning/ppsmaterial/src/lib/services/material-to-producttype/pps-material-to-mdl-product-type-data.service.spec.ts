/**
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { PpsMaterialToMdlProductTypeDataService } from './pps-material-to-mdl-product-type-data.service';
import { HttpClientModule } from '@angular/common/http';

describe('PpsMaterialToMdlProductTypeDataService', () => {
	let service: PpsMaterialToMdlProductTypeDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(PpsMaterialToMdlProductTypeDataService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
