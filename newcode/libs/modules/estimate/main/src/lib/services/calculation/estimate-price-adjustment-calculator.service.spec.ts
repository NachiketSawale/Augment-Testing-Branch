/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { EstimatePriceAdjustmentCalculatorService, Price } from './estimate-price-adjustment-calculator.service';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

describe('EstimatePriceAdjustmentCalculatorService', () => {
	let service: EstimatePriceAdjustmentCalculatorService;
	let item: IEstPriceAdjustmentItemData;

	beforeEach(() => {
		item = {
			Id: 0,
			WqQuantity: 10,
			WqEstimatedPrice: 100,
			WqAdjustmentPrice: 20,
			WqTenderPrice: 120,
			WqDeltaPrice: 20,
			AqQuantity: 5,
			AqEstimatedPrice: 50,
			AqAdjustmentPrice: 10,
			AqTenderPrice: 60,
			AqDeltaPrice: 10,
			UrAdjustment: null,
			UrTender: null,
			UrDelta: null,
			IsUrb: false,
			Factor: 1,
			UrEstimated: 100
		};
		service = new EstimatePriceAdjustmentCalculatorService(item, 'WqAdjustmentPrice', 20, []);
	});

	it('should calculate adjustment correctly', () => {
		service.recalculate();
		expect(item.UrAdjustment).toBeCloseTo(2);
	});

	it('should calculate tender correctly', () => {
		service = new EstimatePriceAdjustmentCalculatorService(item, 'WqTenderPrice', 120, []);
		service.recalculate();
		expect(item.UrTender).toBeCloseTo(12);
	});

	it('should calculate delta correctly', () => {
		service = new EstimatePriceAdjustmentCalculatorService(item, 'WqDeltaPrice', 20, []);
		service.recalculate();
		expect(item.UrDelta).toBeCloseTo(-88);
	});

	it('should handle null values in safeOperation', () => {
		expect(service['safeOperation']('+', null, 10)).toBeNull();
		expect(service['safeOperation']('-', 10, null)).toBeNull();
		expect(service['safeOperation']('*', null, null)).toBeNull();
		expect(service['safeOperation']('/', 10, 0)).toBeNull();
	});

	it('should handle non-number values in safeOperation', () => {
		expect(service['safeOperation']('+', 'a' as never, 10)).toBeNull();
		expect(service['safeOperation']('-', 10, 'b' as never)).toBeNull();
	});

	it('should extract number from string correctly', () => {
		expect(service['extractNumberFromString']('AqAdjustmentPrice')).toBe(0);
		expect(service['extractNumberFromString']('Urb1Adjustment')).toBe(1);
	});

	it('should handle urb adjustment correctly', () => {
		item.IsUrb = true;
		service = new EstimatePriceAdjustmentCalculatorService(item, 'Urb1Adjustment', 20, []);
		service.recalculate();
		expect(item.UrAdjustment).toBe(0);
	});

	it('should handle urb tender correctly', () => {
		item.IsUrb = true;
		service = new EstimatePriceAdjustmentCalculatorService(item, 'Urb1Tender', 120, []);
		service.recalculate();
		expect(item.UrTender).toBe(0);
	});

	it('should handle urb delta correctly', () => {
		item.IsUrb = true;
		service = new EstimatePriceAdjustmentCalculatorService(item, 'Urb1Delta', 20, []);
		service.recalculate();
		expect(item.UrDelta).toBe(-100);
	});
});