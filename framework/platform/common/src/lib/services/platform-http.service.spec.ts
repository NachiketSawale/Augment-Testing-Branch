import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, tick, flush } from '@angular/core/testing';

import { PlatformHttpService } from './platform-http.service';
import { PlatformHttpServiceMock } from '@test/jest-shared';

describe('PlatformHttpService with Jest', () => {
	let service: PlatformHttpService;
	let mockService: PlatformHttpServiceMock;

	beforeEach(() => {
		TestBed.configureTestingModule({
			//providing HttpClient provider
			imports: [HttpClientTestingModule],
			// Providers array with the mock service provided in place of the real service
			providers: [
				{provide: PlatformHttpService, useClass: PlatformHttpServiceMock}
			]
		});
		// Inject the mock service using the token of the real service
		service = TestBed.inject(PlatformHttpService);
		mockService = TestBed.inject(PlatformHttpService) as unknown as PlatformHttpServiceMock;
	});


	it('should inject the mock service', () => {

		expect(service).toBeDefined();  // Check if the service is not undefined
		expect(mockService).toBeDefined();
		expect(service instanceof PlatformHttpServiceMock).toBe(true); // Check if the correct mock is injected
	});

	it('should fetch data correctly with a delay of 200ms', fakeAsync(() => {
		mockService.setDelay(1000);
		const expectedData = {id: 1, name: 'Test User'};
		mockService.setMockResponse('get', 'model/project/projectsettings/setsettings', expectedData,);
		//mockService.setShouldThrowError(false);

		let result: unknown = null;
		mockService.get$('model/project/projectsettings/setsettings').subscribe(data => result = data);

		tick(1000); // Advance the virtual clock
		expect(result).toEqual(expectedData);
		flush();
	}));

	it('should test network latency', fakeAsync(() => {
		mockService.setDelay(500);  // 500 ms delay
		const expectedData = {data: 'delayed response'};
		mockService.setMockResponse('get', 'url', expectedData);

		let result: unknown = null;
		service.get$('url').subscribe(data => {
			result = data;
		});

		tick(250); // Tick partway, should not yet have a result
		expect(result).toBeNull();

		tick(250); // Complete the delay
		expect(result).toEqual(expectedData);
		flush();
	}));

	it('should throw an error for unsupported parameters in get$', (done) => {
		const httpOptions = {headers: {'unsupported-header': 'value'}};
		mockService.get$(' ', httpOptions).subscribe({
			next: () => done.fail('Should have thrown an error for unsupported parameters'),
			error: (error) => {
				expect(error.message).toContain('Unsupported parameters');
				done();
			}
		});
	});

	it('should handle supported parameters in get$', (done) => {
		const httpOptions = {headers: {'headers': 'Something'}};
		mockService.setMockResponse('get', 'some-url', {data: 'Valid data'});
		mockService.get$('some-url', httpOptions).subscribe({
			next: (data) => {
				expect(data).toEqual({data: 'Valid data'});
				done();
			},
			error: done.fail
		});
	});
});