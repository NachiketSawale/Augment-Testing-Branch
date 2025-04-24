import { TestBed } from '@angular/core/testing';

import { StatementSuffixService } from './statement-suffix.service';

describe('StatementSuffixService', () => {
	let service: StatementSuffixService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StatementSuffixService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
