import { TestBed } from '@angular/core/testing';

import { ModuleLayoutService } from './module-layout.service';
import { HttpClientModule } from '@angular/common/http';

describe('ModuleLayoutService', () => {
	let service: ModuleLayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule]
		});
		service = TestBed.inject(ModuleLayoutService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
