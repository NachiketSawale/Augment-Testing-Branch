import { TestBed } from '@angular/core/testing';

import { GridApiService } from './grid-api.service';

describe('GridApiService', () => {
	let service: GridApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GridApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
