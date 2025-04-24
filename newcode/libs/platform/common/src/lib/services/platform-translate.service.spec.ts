import { TestBed } from '@angular/core/testing';

import { PlatformTranslateService } from './platform-translate.service';
import { HttpClientModule } from '@angular/common/http';

describe('PlatformTranslateService', () => {
	let service: PlatformTranslateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports:[
				HttpClientModule
			]
		});
		service = TestBed.inject(PlatformTranslateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
