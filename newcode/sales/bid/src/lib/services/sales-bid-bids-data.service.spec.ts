/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IBidHeaderEntity } from '@libs/sales/interfaces';

import { SalesBidBidsDataService } from './sales-bid-bids-data.service';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';

interface IModified {
	Id: number;
	Name: string;
}
interface IService {
	options: IDataServiceOptions<IBidHeaderEntity>;
}
describe('SalesBidBidsDataService', () => {
	let service: SalesBidBidsDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(SalesBidBidsDataService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize with correct options', () => {
		const options = (service as unknown as IService).options;
		expect(options.apiUrl).toBe('sales/bid');
		expect(options.readInfo.endPoint).toBe('listfiltered');
		expect(options.readInfo.usePost).toBe(true);
		expect(options.deleteInfo.endPoint).toBe('delete');
		expect(options.roleInfo.role).toBe(0);
		expect(options.roleInfo.itemName).toBe('BidHeader');
	});

	describe('createUpdateEntity', () => {
		it('should return a complete entity with mainItemId and BidHeader when modified is not null', () => {
			const modified = { Id: 1, Name: 'Test Bid' } as unknown as IModified;
			const result = service.createUpdateEntity(modified as unknown as IBidHeaderEntity);

			expect(result).toBeInstanceOf(BidHeaderComplete);
			expect(result.MainItemId).toBe(1);
			expect(result.BidHeader).toEqual(modified);
		});

		it('should return a complete entity with default values when modified is null', () => {
			const result = service.createUpdateEntity(null);

			expect(result).toBeInstanceOf(BidHeaderComplete);
			expect(result.MainItemId).toBeDefined();
			expect(result.BidHeader).toBeNull();
		});

		it('should return an array with BidHeader when BidHeader is not null', () => {
			const complete = new BidHeaderComplete();
			complete.BidHeader = { Id: 1, Name: 'Test Bid' } as unknown as IBidHeaderEntity;
			const result = service.getModificationsFromUpdate(complete);

			expect(result).toEqual([complete.BidHeader]);
		});

		it('should return an empty array when BidHeader is null', () => {
			const complete = new BidHeaderComplete();
			complete.BidHeader = null;
			const result = service.getModificationsFromUpdate(complete);

			expect(result).toEqual([]);
		});
	});
});
