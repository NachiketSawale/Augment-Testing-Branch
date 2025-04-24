/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { SalesBidCertificateDataService } from './sales-bid-certificate-data.service';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IBidCertificateEntity, IBidHeaderEntity } from '@libs/sales/interfaces';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';
import { IDataServiceChildRoleOptions, IDataServiceEndPointOptions, ServiceRole } from '@libs/platform/data-access';

describe('SalesBidCertificateDataService', () => {
	let service: SalesBidCertificateDataService;
	let dataService: SalesBidBidsDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
			providers: [
				SalesBidBidsDataService,
				SalesBidCertificateDataService
			]
		});
		dataService = TestBed.inject(SalesBidBidsDataService);
		service = TestBed.inject(SalesBidCertificateDataService);
	});

	it('should have correct apiUrl in options', () => {
		expect(service['options'].apiUrl).toBe('sales/bid/certificate');
	});

	it('should have correct readInfo in options', () => {
		const readInfo = service['options'].readInfo as IDataServiceEndPointOptions;
		expect(readInfo.endPoint).toBe('listbyparent');
		expect(readInfo.usePost).toBe(true);
		expect(readInfo.prepareParam({ id: 1, pKey1: 101 })).toEqual({ pKey1: 101, filter: '' });
	});

	it('should have correct createInfo in options', () => {
		const createInfo = service['options'].createInfo;
		expect(createInfo.prepareParam({ id: 1, pKey1: 101 })).toEqual({ pKey1: 101 });
	});

	it('should have correct roleInfo in options', () => {
		const roleInfo = service['options'].roleInfo as IDataServiceChildRoleOptions<IBidCertificateEntity, IBidHeaderEntity, BidHeaderComplete>;
		expect(roleInfo.role).toBe(ServiceRole.Leaf);
		expect(roleInfo.itemName).toBe('BidCertificate');
		expect(roleInfo.parent).toBe(dataService);
	});

    it('should return true when entity.HeaderFk matches parentKey.Id', () => {
        const parentKey = { Id: 1 } as IBidHeaderEntity;
        const entity = { HeaderFk: 1 } as IBidCertificateEntity;
        expect(service.isParentFn(parentKey, entity)).toBe(true);
    });
    
    it('should return false when entity.HeaderFk does not match parentKey.Id', () => {
        const parentKey = { Id: 1 } as IBidHeaderEntity;
        const entity = { HeaderFk: 2 } as IBidCertificateEntity;
        expect(service.isParentFn(parentKey, entity)).toBe(false);
    });
});
