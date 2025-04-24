import { TestBed } from '@angular/core/testing';

import { ModuleNavBarService } from './nav-bar.service';
import { HttpClientModule } from '@angular/common/http';

describe('PlatformNavBarService', () => {
	let service: ModuleNavBarService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports:[
				HttpClientModule
			]
		});
		service = TestBed.inject(ModuleNavBarService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
