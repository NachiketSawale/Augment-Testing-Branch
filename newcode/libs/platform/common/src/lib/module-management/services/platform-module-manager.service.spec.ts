import { TestBed } from '@angular/core/testing';

import { PlatformModuleManagerService } from './platform-module-manager.service';
import { HttpClientModule } from '@angular/common/http';

describe('ModuleManagerService', () => {
	let service: PlatformModuleManagerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports:[
				HttpClientModule
			]
		});
		service = TestBed.inject(PlatformModuleManagerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('test informContainerResized', () => {
		const spy = jest.spyOn(service, 'informContainerResized');
		service.informContainerResized(true);
		expect(spy).toHaveBeenCalled();
	});
});
