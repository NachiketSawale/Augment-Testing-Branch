import { TestBed } from '@angular/core/testing';

import { PlatformConfigurationService } from './platform-configuration.service';
import { HttpClientModule } from '@angular/common/http';

describe('ConfigurationService', () => {
	let service: PlatformConfigurationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports:[
				HttpClientModule
			]
		});
		service = TestBed.inject(PlatformConfigurationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
