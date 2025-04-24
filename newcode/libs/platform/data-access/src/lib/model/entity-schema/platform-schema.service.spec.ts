import { TestBed } from '@angular/core/testing';

import { PlatformSchemaService } from './platform-schema.service';
import { inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient, HttpHandler } from '@angular/common/http';


interface SampleEntity {
	Id: number;
	Description: string;
}
describe('PlatformSchemaService', () => {
	let service: PlatformSchemaService<SampleEntity>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [HttpClient, HttpHandler]
		});

		TestBed.runInInjectionContext(()=>{
			inject(PlatformConfigurationService);
			service = TestBed.inject(PlatformSchemaService<SampleEntity>);
		});
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
