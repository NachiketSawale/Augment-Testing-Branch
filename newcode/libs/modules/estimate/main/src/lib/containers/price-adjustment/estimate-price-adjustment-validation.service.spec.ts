/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { EstimatePriceAdjustmentValidationService } from './estimate-price-adjustment-validation.service';
import { EstimatePriceAdjustmentDataService } from './estimate-price-adjustment.data.service';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

describe('EstimatePriceAdjustmentValidationService', () => {
	let service: EstimatePriceAdjustmentValidationService;
	let dataService: jest.Mocked<EstimatePriceAdjustmentDataService>;

	beforeEach(() => {
		const dataServiceSpy = {
			recalculate: jest.fn(),
		};

		TestBed.configureTestingModule({
			providers: [EstimatePriceAdjustmentValidationService, { provide: EstimatePriceAdjustmentDataService, useValue: dataServiceSpy }],
		});

		service = TestBed.inject(EstimatePriceAdjustmentValidationService);
		dataService = TestBed.inject(EstimatePriceAdjustmentDataService) as jest.Mocked<EstimatePriceAdjustmentDataService>;
	});

	it('should return entity runtime data from data service', () => {
		expect(service.getEntityRuntimeData()).toBe(dataService);
	});

	it('should validate field successfully', async () => {
		const validationInfo: ValidationInfo<IEstPriceAdjustmentItemData> = {
			entity: {
				Id: 0,
			},
			field: 'AqQuantity',
			value: 100,
		};
		const validationResult: ValidationResult = { valid: true };
		dataService.recalculate.mockResolvedValue(validationResult);

		const result = await service['asyncValidateField'](validationInfo);
		expect(result).toEqual(validationResult);
	});

	it('should handle validation failure', async () => {
		const validationInfo: ValidationInfo<IEstPriceAdjustmentItemData> = {
			entity: {
				Id: 0,
			},
			field: 'AqQuantity',
			value: 100,
		};
		const validationResult: ValidationResult = { valid: false, error: 'Error' };
		dataService.recalculate.mockResolvedValue(validationResult);

		const result = await service['asyncValidateField'](validationInfo);
		expect(result).toEqual(validationResult);
	});

	it('should generate validation functions', () => {
		const validationFunctions = service['generateValidationFunctions']();
		expect(validationFunctions['UrDelta']).toBeDefined();
		expect(validationFunctions['UrAdjustment']).toBeDefined();
		expect(validationFunctions['UrTender']).toBeDefined();
		expect(validationFunctions['Urb1Delta']).toBeDefined();
		expect(validationFunctions['Urb1Adjustment']).toBeDefined();
		expect(validationFunctions['Urb1Tender']).toBeDefined();
		expect(validationFunctions['Urb2Delta']).toBeDefined();
		expect(validationFunctions['Urb2Adjustment']).toBeDefined();
		expect(validationFunctions['Urb2Tender']).toBeDefined();
		expect(validationFunctions['Urb3Delta']).toBeDefined();
		expect(validationFunctions['Urb3Adjustment']).toBeDefined();
		expect(validationFunctions['Urb3Tender']).toBeDefined();
		expect(validationFunctions['Urb4Delta']).toBeDefined();
		expect(validationFunctions['Urb4Adjustment']).toBeDefined();
		expect(validationFunctions['Urb4Tender']).toBeDefined();
		expect(validationFunctions['Urb5Delta']).toBeDefined();
		expect(validationFunctions['Urb5Adjustment']).toBeDefined();
		expect(validationFunctions['Urb5Tender']).toBeDefined();
		expect(validationFunctions['Urb6Delta']).toBeDefined();
		expect(validationFunctions['Urb6Adjustment']).toBeDefined();
		expect(validationFunctions['Urb6Tender']).toBeDefined();
		expect(validationFunctions['WqAdjustmentPrice']).toBeDefined();
		expect(validationFunctions['WqTenderPrice']).toBeDefined();
		expect(validationFunctions['WqDeltaPrice']).toBeDefined();
		expect(validationFunctions['AqQuantity']).toBeDefined();
		expect(validationFunctions['AqAdjustmentPrice']).toBeDefined();
		expect(validationFunctions['AqTenderPrice']).toBeDefined();
		expect(validationFunctions['AqDeltaPrice']).toBeDefined();
	});
});
