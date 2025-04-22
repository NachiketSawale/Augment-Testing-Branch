import { TestBed } from '@angular/core/testing';

import { PlatformDomainService } from './domain.service';

describe('PlatformDomainService', () => {
	let service: PlatformDomainService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformDomainService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
