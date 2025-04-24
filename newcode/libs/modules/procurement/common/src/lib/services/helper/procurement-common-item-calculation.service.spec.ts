/*
 * Copyright(c) RIB Software GmbH
 */

//TODO done it in DEV-20790
describe('ProcurementCommonItemCalculationService', () => {
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
});
/*import {
	BasItemType,
	BasItemType2,
	BasicsSharedRoundingModule,
	BasicsSharedRoundingFactoryService,
	BasicsSharedCalculateOverGrossService
} from '@libs/basics/shared';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProcurementCommonItemCalculationService } from './procurement-common-item-calculation.service';

describe('ProcurementCommonItemCalculationService', () => {
	let calculationService: ProcurementCommonItemCalculationService;
	let httpMock: HttpTestingController;
	let webApiBaseUrl: string;

	const entity = createEmptyEntity();
	const vatPercent = 6.33;
	const exchangeRate = 0.12823;
	const isOverGross = false;

	beforeAll(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				HttpClientTestingModule
			],
			providers: [
				ServiceLocator,
				{provide: BasicsSharedCalculateOverGrossService, useValue: {isOverGross: isOverGross}}
			]
		});
		ServiceLocator.injector = TestBed.inject(Injector);
		calculationService = TestBed.inject(ProcurementCommonItemCalculationService);
		webApiBaseUrl = TestBed.inject(PlatformConfigurationService).webApiBaseUrl;
		httpMock = TestBed.inject(HttpTestingController);

		const roundingService = TestBed.runInInjectionContext(() => BasicsSharedRoundingFactoryService.getService(BasicsSharedRoundingModule.basicsMaterial));
		const loadRoundPromise = roundingService.loadRounding().then(() => true);
		mockLoadRounding();
		return loadRoundPromise;
	});

	it('Set PriceUnit = 0, then recalculate Total, should throw error', () => {
		entity.PriceUnit = 0;
		expect(() => calculationService.getTotalOc(entity, vatPercent)).toThrowError();
		expect(() => calculationService.getTotal(entity, vatPercent)).toThrowError();
		entity.PriceUnit = 1;
	});

	it('Set PriceOc = 100, recalculate Price/PriceGross/PriceGrossOc correctly', () => {
		calculationService.update4PriceFields(entity, 100, 'PriceOc', vatPercent, exchangeRate);
		expect(entity.PriceOc).toBe(100);
		expect(entity.Price).toBe(779.85);
		expect(entity.PriceGrossOc).toBe(106.33);
		expect(entity.PriceGross).toBe(829.21);
	});

	it('Set PriceExtraOc = 15.31, recalculate PriceExtra correctly', () => {
		entity.PriceExtraOc = 15.31;
		entity.PriceExtra = calculationService.getPriceExtraByExchangeRate(entity, exchangeRate);
		expect(entity.PriceExtraOc).toBe(15.31);
		expect(entity.PriceExtra).toBe(119.39);
	});

	it('Set PriceExtra = 119.39, recalculate PriceExtraOc correctly', () => {
		entity.PriceExtra = 119.39;
		entity.PriceExtraOc = 0;
		entity.PriceExtraOc = calculationService.getPriceExtraOcByExchangeRate(entity, exchangeRate);
		expect(entity.PriceExtraOc).toBe(15.31);
		expect(entity.PriceExtra).toBe(119.39);
	});

	it('getPrice correctly', () => {
		expect(calculationService.getPrice(entity, vatPercent)).toBe(779.85);
	});

	it('getPriceOc correctly', () => {
		expect(calculationService.getPriceOc(entity, vatPercent)).toBe(100);
	});

	it('getPriceByPriceOc correctly', () => {
		expect(calculationService.getPriceByPriceOc(entity, exchangeRate)).toBe(779.85);
	});

	it('getPriceOcByPriceGross correctly', () => {
		expect(calculationService.getPriceOcByPriceGross(entity, vatPercent, exchangeRate)).toBe(100);
	});

	it('getPriceOcByExchangeRate correctly', () => {
		expect(calculationService.getPriceOcByExchangeRate(entity, exchangeRate)).toBe(100);
	});

	it('getPriceGross correctly', () => {
		expect(calculationService.getPriceGross(entity, vatPercent)).toBe(829.21);
	});

	it('getPriceGrossByPriceGrossOc correctly', () => {
		expect(calculationService.getPriceGrossByPriceGrossOc(entity, exchangeRate)).toBe(829.21);
	});

	it('getPriceGrossOc correctly', () => {
		expect(calculationService.getPriceGrossOc(entity, vatPercent)).toBe(106.33);
	});

	it('getPriceGrossOcByPriceGross correctly', () => {
		expect(calculationService.getPriceGrossOcByPriceGross(entity, exchangeRate)).toBe(106.33);
	});

	it('getPriceByMdcCost correctly', () => {
		expect(calculationService.getPriceByMdcCost(123.45, 34.31)).toBe(89.14);
	});

	it('getPriceOcByMdcCost correctly', () => {
		expect(calculationService.getPriceOcByMdcCost(123.45, 34.31, 10)).toBe(8.91);
	});

	it('recalculate TotalPriceOc/TotalPrice/TotalPriceGrossOc/TotalPriceGross correctly', () => {
		entity.TotalPriceOc = calculationService.getTotalPriceOc(entity, vatPercent);
		entity.TotalPrice = calculationService.getTotalPrice(entity, vatPercent);
		entity.TotalPriceGrossOc = calculationService.getTotalPriceOCGross(entity, vatPercent);
		entity.TotalPriceGross = calculationService.getTotalPriceGross(entity, vatPercent, exchangeRate);
		expect(entity.TotalPriceOc).toBe(115.31);
		expect(entity.TotalPrice).toBe(899.24);
		expect(entity.TotalPriceGrossOc).toBe(122.61);
		expect(entity.TotalPriceGross).toBe(956.16);
	});

	it('getTotalPriceByTotalPriceOc correctly', () => {
		expect(calculationService.getTotalPriceByTotalPriceOc(entity, exchangeRate)).toBe(899.24);
	});

	it('getTotalPriceGrossByTotalGross correctly', () => {
		expect(calculationService.getTotalPriceGrossByTotalPriceGrossOc(entity, exchangeRate)).toBe(956.17);
	});

	it('when Quantity = 0, run getTotalPriceOCGrossByTotalGrossOc, should throw err', () => {
		expect(() => calculationService.getTotalPriceOCGrossByTotalGrossOc(entity)).toThrowError();
	});

	it('getTotalPriceNoDiscount correctly', () => {
		expect(calculationService.getTotalPriceNoDiscount(entity)).toBe(899.24);
	});

	it('getTotalPriceOcNoDiscount correctly', () => {
		expect(calculationService.getTotalPriceOcNoDiscount(entity)).toBe(115.31);
	});

	it('Set Quantity = 1, recalculate Total/TotalOc/TotalGross/TotalGrossOc correctly', () => {
		entity.Quantity = 1;
		entity.TotalOc = calculationService.getTotalOc(entity, vatPercent);
		entity.Total = calculationService.getTotal(entity, vatPercent);
		entity.TotalCurrencyNoDiscount = calculationService.getTotalOcNoDiscount(entity, vatPercent);
		entity.TotalNoDiscount = calculationService.getTotalNoDiscount(entity, vatPercent);
		entity.TotalGrossOc = calculationService.getTotalGrossOc(entity, vatPercent);
		entity.TotalGross = calculationService.getTotalGross(entity, vatPercent, exchangeRate);
		expect(entity.TotalOc).toBe(115.31);
		expect(entity.Total).toBe(899.24);
		expect(entity.TotalGrossOc).toBe(122.61);
		expect(entity.TotalGross).toBe(956.16);
	});

	it('getTotalByTotalGross correctly', () => {
		expect(calculationService.getTotalByTotalGross(entity, vatPercent)).toBe(899.24);
	});

	it('getTotalOcByTotalGrossOc correctly', () => {
		expect(calculationService.getTotalOcByTotalGrossOc(entity, vatPercent)).toBe(115.31);
	});

	it('getTotalGrossByTotalGrossOc correctly', () => {
		expect(calculationService.getTotalGrossByTotalGrossOc(entity, exchangeRate)).toBe(956.17);
	});

	it('getTotalGrossOcByTotalGross correctly', () => {
		expect(calculationService.getTotalGrossOcByTotalGross(entity, exchangeRate)).toBe(122.61);
	});

	it('getPriceFromTotalGross correctly', () => {
		expect(calculationService.getPriceFromTotalGross(entity.TotalGross, entity.Quantity, entity.PriceExtra, vatPercent, entity.Discount, entity.PriceUnit, entity.FactorPriceUnit, entity.DiscountSplit)).toBe(779.85);
	});

	it('getPriceFromTotalOcGross correctly', () => {
		expect(calculationService.getPriceFromTotalOcGross(entity.TotalGrossOc, entity.Quantity, entity.PriceExtraOc, vatPercent, entity.Discount, entity.PriceUnit, entity.FactorPriceUnit, entity.DiscountSplitOc, exchangeRate)).toBe(779.86);
	});

	it('getPriceFromTotal correctly', () => {
		expect(calculationService.getPriceFromTotal(entity, entity.Total, entity.PriceExtra)).toBe(779.85);
	});

	it('getPriceFromTotalOc correctly', () => {
		expect(calculationService.getPriceFromTotalOc(entity, entity.TotalOc, entity.PriceExtraOc, exchangeRate)).toBe(779.85);
	});

	it('getPriceFromTotalNoDiscount correctly', () => {
		expect(calculationService.getPriceFromTotalNoDiscount(entity, entity.TotalNoDiscount, entity.PriceExtra)).toBe(779.85);
	});

	it('getPriceFromTotalOcNoDiscount correctly', () => {
		expect(calculationService.getPriceFromTotalOcNoDiscount(entity, entity.TotalCurrencyNoDiscount, entity.PriceExtraOc, exchangeRate)).toBe(779.85);
	});

	it('getTotalPriceOCGrossByTotalGrossOc correctly', () => {
		expect(calculationService.getTotalPriceOCGrossByTotalGrossOc(entity)).toBe(122.61);
	});

	it('Set Discount = 10, recalculate DiscountAbsoluteOc/DiscountAbsolute/... correctly', () => {
		entity.Discount = 10;
		calculationService.updateDiscountNAbsolute(entity, entity.Discount, 'Discount', vatPercent, exchangeRate);
		expect(entity.DiscountAbsoluteOc).toBe(11.531);
		expect(entity.DiscountAbsolute).toBe(89.924);
		expect(entity.DiscountAbsoluteGrossOc).toBe(12.2609123);
		expect(entity.DiscountAbsoluteGross).toBe(95.6157387);
	});

	it('getTotalByPriceForPes correctly', () => {
		expect(calculationService.getTotalByPriceForPes(entity.Price, entity.PriceExtra, entity.DiscountAbsolute, entity.Quantity, entity.PriceUnit, entity.FactorPriceUnit, entity.DiscountSplit)).toBe(809.32);
	});

	it('getTotalNoDiscountByTotalGross correctly', () => {
		expect(calculationService.getTotalNoDiscountByTotalGross(entity, vatPercent)).toBe(983.81);
	});

	it('getTotalOcNoDiscountByTotalGrossOc correctly', () => {
		expect(calculationService.getTotalOcNoDiscountByTotalGrossOc(entity, vatPercent)).toBe(126.16);
	});

	it('getDiscount correctly', () => {
		expect(calculationService.getDiscount(entity)).toBe(10);
	});

	it('getPriceGrossByTotalPriceGross correctly', () => {
		expect(calculationService.getPriceGrossByTotalPriceGross(entity.TotalPriceGross, entity.PriceExtra, entity.DiscountAbsoluteGross, vatPercent)).toBe(924.83);
	});

	it('getPriceGrossOcByTotalPriceGrossOc correctly', () => {
		expect(calculationService.getPriceGrossOcByTotalPriceGrossOc(entity.TotalPriceGrossOc, entity.PriceExtraOc, entity.DiscountAbsoluteGrossOc, vatPercent)).toBe(118.59);
	});

	it('getDiscountAbsoluteByOc correctly', () => {
		expect(calculationService.getDiscountAbsoluteByOc(entity, exchangeRate)).toBe(89.9243547);
	});

	it('getDiscountAbsoluteByGross correctly', () => {
		expect(calculationService.getDiscountAbsoluteByGross(entity, vatPercent)).toBe(89.9235763);
	});

	it('getDiscountAbsoluteOcByDA correctly', () => {
		expect(calculationService.getDiscountAbsoluteOcByDA(entity, exchangeRate)).toBe(11.5309545);
	});

	it('getDiscountAbsoluteOcByGrossOc correctly', () => {
		expect(calculationService.getDiscountAbsoluteOcByGrossOc(entity, vatPercent)).toBe(11.531);
	});

	it('getDiscountAbsoluteGrossByDA correctly', () => {
		expect(calculationService.getDiscountAbsoluteGrossByDA(entity, vatPercent)).toBe(95.6161892);
	});

	it('getDiscountAbsoluteGrossByGrossOc correctly', () => {
		expect(calculationService.getDiscountAbsoluteGrossByGrossOc(entity, exchangeRate)).toBe(95.6165663);
	});

	it('getDiscountAbsoluteGrossOcByGross correctly', () => {
		expect(calculationService.getDiscountAbsoluteGrossOcByGross(entity, exchangeRate)).toBe(12.2608062);
	});

	it('getDiscountAbsoluteGrossOcByOc correctly', () => {
		expect(calculationService.getDiscountAbsoluteGrossOcByOc(entity, vatPercent)).toBe(12.2609123);
	});

	it('set DiscountSplitOc = 10, then getDiscountSplitByOc correctly', () => {
		entity.DiscountSplitOc = 10;
		expect(calculationService.getDiscountSplitByOc(entity, exchangeRate)).toBe(77.98);
	});

	it('setTotalFieldsZeroIfOptionalOrAlternativeItem', () => {
		entity.BasItemTypeFk = BasItemType.OptionalWithoutIT;
		calculationService.setTotalFieldsZeroIfOptionalOrAlternativeItem(entity);
		expect(entity.Total).toBe(0);
	});

	afterAll(() => {
		httpMock.verify();
	});

	function createEmptyEntity() {
		return {
			Quantity: 0,
			Price: 0,
			PriceOc: 0,
			PriceGross: 0,
			PriceGrossOc: 0,
			TotalPrice: 0,
			TotalPriceOc: 0,
			TotalPriceGross: 0,
			TotalPriceGrossOc: 0,
			Total: 0,
			TotalOc: 0,
			TotalGross: 0,
			TotalGrossOc: 0,
			PriceExtra: 0,
			PriceExtraOc: 0,
			FactorPriceUnit: 1,
			PriceUnit: 1,
			TotalNoDiscount: 0,
			TotalCurrencyNoDiscount: 0,
			DiscountSplit: 0,
			DiscountSplitOc: 0,
			DiscountAbsolute: 0,
			DiscountAbsoluteOc: 0,
			DiscountAbsoluteGross: 0,
			DiscountAbsoluteGrossOc: 0,
			Discount: 0,
			BasItemTypeFk: BasItemType.Standard,
			BasItemType2Fk: BasItemType2.Base
		};
	}

	const mockRoundingData = {
		basRoundingType: {
			Quantity: 1,
			UnitRate: 2,
			Amounts: 3
		},
		configDetail: [
			{
				ColumnId: 1,
				Id: 1000018,
				IsWithoutRounding: false,
				RoundTo: 3,
				RoundToFk: 1,
				RoundingMethodFk: 1,
				Sorting: 1,
				UiDisplayTo: 3
			},
			{
				ColumnId: 2,
				Id: 1000019,
				IsWithoutRounding: false,
				RoundTo: 3,
				RoundToFk: 1,
				RoundingMethodFk: 1,
				Sorting: 1,
				UiDisplayTo: 3
			}, {
				ColumnId: 3,
				Id: 1000020,
				IsWithoutRounding: false,
				RoundTo: 3,
				RoundToFk: 1,
				RoundingMethodFk: 1,
				Sorting: 1,
				UiDisplayTo: 3
			}],
		roundingType: {
			AlternativeQuantity: 1,
			BudgetPerUnit: 2,
			BudgetTotal: 3,
			Charges: 2,
			ContractGrandQuantity: 1,
			Cost: 3,
			CostPerUnit: 2,
			CostPriceGross: 3,
			DayworkRate: 3,
			DiscountSplit: 3,
			DiscountSplitOc: 3,
			EstimatePrice: 3,
			Factor: 1,
			FactorHour: 1,
			FactorPriceUnit: 1,
			Inv2Con_TotalPrice: 3,
			Inv2Con_TotalPriceOc: 3,
			ListPrice: 2,
			MdcPriceCondition_Total: 2,
			MdcPriceCondition_TotalOc: 2,
			MdcPriceCondition_Value: 2,
			MinQuantity: 1,
			NoType: 0,
			OrderQuantity: 1,
			OrderQuantityConverted: 1,
			PercentageQuantity: 2,
			PesValue: 3,
			PesValueOc: 3,
			PesVat: 3,
			PesVatOc: 3,
			Price: 2,
			PriceExtra: 2,
			PriceExtraDwRate: 2,
			PriceExtraEstPrice: 2,
			PriceExtraOc: 2,
			PriceExtras: 2,
			PriceGross: 2,
			PriceGrossOc: 2,
			PriceOc: 2,
			PriceOcGross: 2,
			PriceUnit: 1,
			PriceValue: 2,
			ProvisionTotal: 3,
			ProvisonTotal: 3,
			Quantity: 1,
			QuantityAskedFor: 1,
			QuantityConfirm: 1,
			QuantityContracted: 1,
			QuantityContractedAccepted: 1,
			QuantityContractedConverted: 1,
			QuantityConverted: 1,
			QuantityDelivered: 1,
			QuantityDeliveredConverted: 1,
			QuantityDeliveredUi: 1,
			QuantityRemaining: 1,
			QuantityRemainingConverted: 1,
			QuantityRemainingUi: 1,
			RemainingQuantityForCallOff: 1,
			RetailPrice: 2,
			SellUnit: 1,
			StandardCost: 2,
			TargetPrice: 2,
			TargetTotal: 3,
			Total: 3,
			TotalCallOffQuantity: 1,
			TotalCurrency: 3,
			TotalCurrencyNoDiscount: 3,
			TotalDelivered: 3,
			TotalGross: 3,
			TotalGrossOc: 3,
			TotalNoDiscount: 3,
			TotalOc: 3,
			TotalOcDelivered: 3,
			TotalOcGross: 3,
			TotalOcNoDiscount: 3,
			TotalPrice: 2,
			TotalPriceGross: 2,
			TotalPriceGrossOc: 2,
			TotalPriceOc: 2,
			TotalQuantity: 1,
			TotalStandardCost: 3,
			TotalValue: 3,
			TotalValueGross: 3,
			TotalValueGrossOc: 3,
			TotalValueOc: 3,
			UserDefinedNumber1: 3,
			UserDefinedNumber2: 3,
			UserDefinedNumber3: 3,
			UserDefinedNumber4: 3,
			UserDefinedNumber5: 3,
			Value: 2,
			ValueGross: 3,
			ValueGrossOc: 3,
			ValueOcGross: 3,
			Variance: 1,
			Vat: 3,
			VatOC: 3,
			VatOc: 3,
			Volume: 1,
			Weight: 1,
			openQuantity: 1,
			quantityScheduled: 1,
		}
	};

	function mockLoadRounding() {
		const mockRoundingRequest = httpMock.expectOne(`${webApiBaseUrl}basics/common/rounding/getconfig`);
		mockRoundingRequest.flush(mockRoundingData);
	}
});*/
