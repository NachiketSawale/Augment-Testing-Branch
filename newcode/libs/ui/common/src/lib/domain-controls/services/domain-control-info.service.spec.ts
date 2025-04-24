import { TestBed } from '@angular/core/testing';

import { DomainControlInfoService } from './domain-control-info.service';

describe('DomainControlInfoService', () => {
	let service: DomainControlInfoService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DomainControlInfoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
