import { TestBed } from '@angular/core/testing';

import { EditorControlContextService } from './editor-control-context.service';

describe('EditorControlContextService', () => {
	let service: EditorControlContextService<object>;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(EditorControlContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});