import { TestBed } from '@angular/core/testing';

import { PlatformLogonService } from './platform-logon.service';

describe('LogonService', () => {
	let service: PlatformLogonService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformLogonService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
