import { TestBed } from '@angular/core/testing';

import { DesktopGroupListService } from './desktop-group-list.service';

describe('DesktopGroupListService', () => {
	let service: DesktopGroupListService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DesktopGroupListService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
