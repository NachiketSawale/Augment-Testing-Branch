/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SalesBillingAccrualDataService } from './sales-billing-accrual-data.service';
import { SalesBillingBillsDataService } from './sales-billing-bills-data.service';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { get } from 'lodash';

describe('SalesBillingAccrualDataService', () => {
	let service: SalesBillingAccrualDataService;
	let httpTestingController: HttpTestingController;
	let parentDataService: SalesBillingBillsDataService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [SalesBillingBillsDataService, SalesBillingAccrualDataService],
		});
		TestBed.runInInjectionContext(() => {
			httpTestingController = TestBed.inject(HttpTestingController);
			parentDataService = TestBed.inject(SalesBillingBillsDataService);
			service = TestBed.inject(SalesBillingAccrualDataService);
		});
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should provide load payload', () => {
		const selectedEntity = { Id: 1020002 } as IBilHeaderEntity;
		jest.spyOn(parentDataService, 'getSelectedEntity').mockReturnValue(selectedEntity);
		const payload = service['provideLoadPayload']();
		expect(payload).toEqual({ mainItemId: 1020002 });
	});

	it('should handle load succeeded', () => {
		//TODO:currently API give response in empty object format,so we create a mock of empty object
		const loaded = {
			Main: [],
			TransactionHeader: []
		};

		const expectedOutput = get(loaded, 'Main', []);

        const result = service['onLoadSucceeded'](loaded);
        
        expect(result).toEqual(expectedOutput);
	});

	it('should return empty array if load failed', () => {
		const result = service['onLoadSucceeded'](null);
		expect(result).toEqual([]);
	});
});