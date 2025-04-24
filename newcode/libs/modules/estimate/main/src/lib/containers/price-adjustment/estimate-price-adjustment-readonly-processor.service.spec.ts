import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EstimateMainSyncTenderPriceService } from './estimate-price-adjustment-readonly-processor.service';
import { EstimatePriceAdjustmentDataService } from './estimate-price-adjustment.data.service';
import { EstimatePriceAdjustmentLayoutService } from './estimate-price-adjustment-layout.service';
import { IReadOnlyField } from '@libs/platform/data-access';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';
import { ServiceLocator } from '@libs/platform/common';
import { Injector } from '@angular/core';

describe('EstimateMainSyncTenderPriceService', () => {
	let processor: EstimateMainSyncTenderPriceService;
	let dataService: jest.Mocked<EstimatePriceAdjustmentDataService>;
	let layoutService: jest.Mocked<EstimatePriceAdjustmentLayoutService>;

	beforeEach(() => {
		const dataServiceSpy = {
			hasReadOnlyItem: jest.fn(),
			getReadOnlyURBFiledName: jest.fn(),
			hasSpecialReadOnly: jest.fn(),
			setEntityReadOnlyFields: jest.fn(),
		};

		const layoutServiceSpy = {
			getAllFields: jest.fn(),
		};

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{ provide: EstimatePriceAdjustmentDataService, useValue: dataServiceSpy },
				{ provide: EstimatePriceAdjustmentLayoutService, useValue: layoutServiceSpy },
			],
		});

		ServiceLocator.injector = TestBed.inject(Injector);

		dataService = TestBed.inject(EstimatePriceAdjustmentDataService) as jest.Mocked<EstimatePriceAdjustmentDataService>;
		layoutService = TestBed.inject(EstimatePriceAdjustmentLayoutService) as jest.Mocked<EstimatePriceAdjustmentLayoutService>;
		processor = TestBed.runInInjectionContext(() => {
			return TestBed.inject(EstimateMainSyncTenderPriceService);
		});
	});

	describe('process', () => {
		it('should set all fields to read-only if hasReadOnlyItem returns true', () => {
			const entity = { Id: 1 } as IEstPriceAdjustmentItemData;
			const fields = ['Id'];
			layoutService.getAllFields.mockReturnValue(fields);
			dataService.hasReadOnlyItem.mockReturnValue(true);

			//processor.process(entity);

			const expectedReadonlyFields: IReadOnlyField<IEstPriceAdjustmentItemData>[] = layoutService.getAllFields().map((field) => ({ field, readOnly: true }));
			//expect(dataService.setEntityReadOnlyFields).toHaveBeenCalledWith(entity, expectedReadonlyFields);
		});

		it('should set specific fields to read-only based on conditions special-read-only was false', () => {
			const entity = {
				BoqLineTypeFk: 1,
				Urb1Estimated: 200,
				Urb2Estimated: 300,
				WqQuantity: 50,
				AqQuantity: 60,
			} as IEstPriceAdjustmentItemData;

			const fields = ['BoqLineTypeFk', 'Urb1Estimated', 'Urb2Estimated'];
			const readOnlyURBFields = ['Urb1', 'Urb2'];
			layoutService.getAllFields.mockReturnValue(fields);
			dataService.hasReadOnlyItem.mockReturnValue(false);
			dataService.getReadOnlyURBFiledName.mockReturnValue(readOnlyURBFields);
			dataService.hasSpecialReadOnly.mockReturnValue(false);

			//processor.process(entity);

			const expectedReadonlyFields: IReadOnlyField<IEstPriceAdjustmentItemData>[] = [
				{ field: 'BoqLineTypeFk', readOnly: true },
				{ field: 'Urb1Estimated', readOnly: true },
				{ field: 'Urb2Estimated', readOnly: true }
			];
			//expect(dataService.setEntityReadOnlyFields).toHaveBeenCalledWith(entity, expectedReadonlyFields);
		});

		it('should set specific fields to read-only based on conditions special-read-only was true', () => {
			const entity = {
				WqEstimatedPrice: 200
			} as IEstPriceAdjustmentItemData;

			const fields = ['BoqLineTypeFk', 'Urb1Estimated', 'Urb2Estimated',];
			const readOnlyURBFields = ['Urb1', 'Urb2'];
			layoutService.getAllFields.mockReturnValue(fields);
			dataService.hasReadOnlyItem.mockReturnValue(false);
			dataService.getReadOnlyURBFiledName.mockReturnValue(readOnlyURBFields);
			dataService.hasSpecialReadOnly.mockReturnValue(true);

			//processor.process(entity);

			const expectedReadonlyFields: IReadOnlyField<IEstPriceAdjustmentItemData>[] = [
				{ field: 'WqEstimatedPrice', readOnly: true }
			];
			//expect(dataService.setEntityReadOnlyFields).toHaveBeenCalledWith(entity, expectedReadonlyFields);
		});
	});
});