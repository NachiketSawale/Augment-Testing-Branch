/**
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PpsCadToMaterialDataService } from './pps-cad-to-material-data.service';

describe('PpsCadToMaterialDataService', () => {
	let service: PpsCadToMaterialDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(PpsCadToMaterialDataService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
