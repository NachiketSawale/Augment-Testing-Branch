/**
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { get } from 'lodash';
import { IBidHeaderEntity, IBidWarrantyEntity } from '@libs/sales/interfaces';
import { IDataServiceChildRoleOptions, IDataServiceEndPointOptions, ServiceRole } from '@libs/platform/data-access';
import { SalesBidWarrantyDataService } from './sales-bid-warranty-data.service';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';

describe('SalesBidWarrantyDataService', () => {
	let service: SalesBidWarrantyDataService;
	let bidService: SalesBidBidsDataService;

	jest.mock('lodash', () => ({
		get: jest.fn((obj, path, defaultValue) => (obj && obj[path] ? obj[path] : defaultValue)),
	}));
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [SalesBidWarrantyDataService, SalesBidBidsDataService],
		});
		service = TestBed.inject(SalesBidWarrantyDataService);
		bidService = TestBed.inject(SalesBidBidsDataService);
	});
	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should have correct apiUrl in options', () => {
		expect(service['options'].apiUrl).toBe('sales/bid/warranty');
	});

	it('should have correct readInfo in options', () => {
		const readInfo = service['options'].readInfo as IDataServiceEndPointOptions;
		expect(readInfo.endPoint).toBe('listByParent');
		expect(readInfo.usePost).toBe(true);
	});

	it('should have correct createInfo in options', () => {
		const createInfo = service['options'].createInfo;
		expect(createInfo.prepareParam({ id: 1, pKey1: 101 })).toEqual({ Pkey1: 101 });
	});

	it('should have correct roleInfo in options', () => {
		const roleInfo = service['options'].roleInfo as IDataServiceChildRoleOptions<IBidWarrantyEntity, IBidHeaderEntity, BidHeaderComplete>;
		expect(roleInfo.role).toBe(ServiceRole.Leaf);
		expect(roleInfo.itemName).toBe('BidWarranty');
		expect(roleInfo.parent).toBe(bidService);
	});

	it('should provide load payload with selected entity', () => {
		const selectedEntity = { Id: 1020002 } as IBidHeaderEntity;
		jest.spyOn(bidService, 'getSelection').mockReturnValue([selectedEntity]);
		const payload = service['provideLoadPayload']();
		expect(payload).toEqual({ Pkey1: 1020002, filter: '' });
	});

	it('should provide load payload with no selected entity', () => {
		jest.spyOn(bidService, 'getSelection').mockReturnValue([]);
		const payload = service['provideLoadPayload']();
		expect(payload).toEqual({ Pkey1: undefined, filter: '' });
	});

	it('should handle load succeeded', () => {
		const loaded = {
			Main: [],
			TransactionHeader: [],
		};
		const expectedOutput = get(loaded, 'Main', []);
		const result = service['onLoadSucceeded'](loaded);
		expect(result).toEqual(expectedOutput);
	});
	it('should return empty array if load failed', () => {
		const result = service['onLoadSucceeded'](null);
		expect(result).toEqual([]);
	});
	it('should return true when entity.HeaderFk matches parentKey.Id', () => {
		const parentKey = { Id: 1 } as IBidHeaderEntity;
		const entity = { BidHeaderFk: 1 } as IBidWarrantyEntity;
		expect(service.isParentFn(parentKey, entity)).toBe(true);
	});

	it('should return false when entity.HeaderFk does not match parentKey.Id', () => {
		const parentKey = { Id: 1 } as IBidHeaderEntity;
		const entity = { BidHeaderFk: 2 } as IBidWarrantyEntity;
		expect(service.isParentFn(parentKey, entity)).toBe(false);
	});
});
