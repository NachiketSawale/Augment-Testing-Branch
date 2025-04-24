import { TestBed } from '@angular/core/testing';

import { WizardCounterService } from './wizard-counter.service';

describe('WizardCounterService', () => {
	let service: WizardCounterService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WizardCounterService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
