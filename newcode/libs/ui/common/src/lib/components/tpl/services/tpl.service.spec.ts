/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';

import { TplService } from './tpl.service';
// import { tpl, data } from '../../../mock-data/tpl';
describe('TplService', () => {
	let service: TplService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TplService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	// Deleted The mock-data of tpl and data
	
	// it('should call parse()', () => {
	// 	jest.spyOn(service, 'parse');
	// 	service.parse(tpl, data);
	// 	expect(service.parse).toHaveBeenCalled();
	// });
});
