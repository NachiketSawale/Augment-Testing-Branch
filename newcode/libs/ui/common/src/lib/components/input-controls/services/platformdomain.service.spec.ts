/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlatformdomainService } from './platformdomain.service';
import { PlatformDomainServiceData } from '../../../mock-data/input-control-mock-data/platform-domain-service-data';
describe('PlatformdomainService', () => {
	let service: PlatformdomainService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule],
		});
		service = TestBed.inject(PlatformdomainService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('loadDomain function test', () => {
		const result = service.loadDomain(PlatformDomainServiceData.input);
		expect(result).toEqual(PlatformDomainServiceData.output);
	});
});
