/*
 * Copyright(c) RIB Software GmbH
 */


import { BasicsSharedRoundingService } from './basics-shared-rounding.service';
import { BasicsSharedRoundingFactoryService } from './basics-shared-rounding-factory.service';
import { BasicsSharedRoundingModule as roundingModule } from '../model/basics-shared-rounding-module';
import { PlatformConfigurationService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IConfigDetail, IExtraGridRoundConfig } from '../model/interfaces/round-config.interface';
import { FieldType, IGridConfiguration, ILayoutConfiguration } from '@libs/ui/common';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { RoundingColumnDef, RoundingFieldOverloadSpec, RoundingTransientFieldSpec } from '../model/rounding-field-extensions.type';

describe('BasicsSharedRoundingFactoryService', () => {

	let roundingService: BasicsSharedRoundingService<IConfigDetail>;
	let httpMock: HttpTestingController;
	let webApiBaseUrl: string;

	beforeAll(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				HttpClientTestingModule
			]
		});
		ServiceLocator.injector = TestBed.inject(Injector);
		webApiBaseUrl = TestBed.inject(PlatformConfigurationService).webApiBaseUrl;
		httpMock = TestBed.inject(HttpTestingController);


		roundingService = TestBed.runInInjectionContext(() => BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial));
		const loadRoundPromise = roundingService.loadRounding().then(() => true);
		mockLoadRounding();
		return loadRoundPromise;
	});

	it('To doRounding', () => {
		//RoundTo: 3 Math.round
		expect(roundingService.doRounding(1, 100.1234)).toBe(100.123);
		expect(roundingService.doRounding(1, 100.1235)).toBe(100.124);
		expect(roundingService.doRounding(1, -100.1234)).toBe(-100.123);
		expect(roundingService.doRounding(1, -100.1235)).toBe(-100.124);

		//RoundTo: 3 Math.ceil
		expect(roundingService.doRounding(2, 100.1234)).toBe(100.124);
		expect(roundingService.doRounding(2, -100.1234)).toBe(-100.123);

		//RoundTo: 3 Math.floor
		expect(roundingService.doRounding(3, 100.1236)).toBe(100.123);
		expect(roundingService.doRounding(3, -100.1236)).toBe(-100.124);
	});

	it('To Run uiRoundingConfig', () => {
		const layout = <ILayoutConfiguration<IMaterialPriceConditionEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Value',
						'Total',
						'TotalOc',
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Value': {
						text: 'Value',
						key: 'priceValue'
					},
					'Total': {
						text: 'Total',
						key: 'priceTotal'
					},
					'TotalOc': {
						text: 'TotalOc',
						key: 'priceTotalOc'
					}
				})
			},
			overloads: {
				Total: <RoundingFieldOverloadSpec<IMaterialPriceConditionEntity>>{
					roundingField: 'MdcPriceCondition_Total'
				}
			},
			transientFields: [
				<RoundingTransientFieldSpec<IMaterialPriceConditionEntity>>{
					model: 'TotalOc',
					roundingField: 'MdcPriceCondition_TotalOc',
					type: FieldType.Decimal,
				}
			]
		};
		const expectedOverloads = {
			Value: {
				formatterOptions: {
					decimalPlaces: 3
				}
			},
			Total: <RoundingFieldOverloadSpec<IMaterialPriceConditionEntity>>{
				roundingField: 'MdcPriceCondition_Total',
				formatterOptions: {
					decimalPlaces: 4
				}
			}
		};

		const expectedTransientFields = [
			<RoundingTransientFieldSpec<IMaterialPriceConditionEntity>>{
				formatterOptions: {
					decimalPlaces: 5
				},
				model: 'TotalOc',
				roundingField: 'MdcPriceCondition_TotalOc',
				type: FieldType.Decimal,
			}
		];

		roundingService.uiRoundingConfig(layout);
		expect(layout.overloads).toEqual(expectedOverloads);
		expect(layout.transientFields).toEqual(expectedTransientFields);

	});

	it('To Run extraUiRoundingConfig', () => {
		const extraStrL: IExtraGridRoundConfig<IMaterialPriceConditionEntity> = {
			extraStr: '_NEW',
			columns: [{
				id: 'Value',
				model: 'Value',
				type: FieldType.Decimal,
				sortable: true,
			}, <RoundingColumnDef<IMaterialPriceConditionEntity>>{
				id: 'Total',
				model: 'Total',
				type: FieldType.Decimal,
				sortable: true,
				roundingField: 'MdcPriceCondition_Total',
			}, {
				id: 'Value_NEW',
				model: 'Value_NEW',
				type: FieldType.Decimal,
				sortable: true,
			}, {
				id: 'Total_NEW',
				model: 'Total_NEW',
				type: FieldType.Decimal,
				sortable: true,
			}],
		};
		roundingService.extraUiRoundingConfig(extraStrL);
		const expectedExtraStrL = [{
			id: 'Value',
			model: 'Value',
			type: FieldType.Decimal,
			sortable: true,
			formatterOptions: {
				decimalPlaces: 3
			},
		}, <RoundingColumnDef<IMaterialPriceConditionEntity>>{
			id: 'Total',
			model: 'Total',
			type: FieldType.Decimal,
			sortable: true,
			roundingField: 'MdcPriceCondition_Total',
			formatterOptions: {
				decimalPlaces: 4
			},
		}, {
			id: 'Value_NEW',
			model: 'Value_NEW',
			type: FieldType.Decimal,
			sortable: true,
			formatterOptions: {
				decimalPlaces: 3
			},
		}, {
			id: 'Total_NEW',
			model: 'Total_NEW',
			type: FieldType.Decimal,
			sortable: true,
			formatterOptions: {
				decimalPlaces: 5
			},
		}];
		expect(extraStrL.columns).toEqual(expectedExtraStrL);
	});

	it('To Run lookUpRoundingConfig', () => {
		const gridConfiguration: IGridConfiguration<IMaterialPriceConditionEntity> = {
			columns: [{
				id: 'Value',
				model: 'Value',
				type: FieldType.Decimal,
				sortable: true,
			}, <RoundingColumnDef<IMaterialPriceConditionEntity>>{
				id: 'Total',
				model: 'Total',
				type: FieldType.Decimal,
				sortable: true,
				roundingField: 'MdcPriceCondition_Total',
			}],
		};
		const expectedGridConfiguration = [{
			id: 'Value',
			model: 'Value',
			type: FieldType.Decimal,
			sortable: true,
			formatterOptions: {
				decimalPlaces: 3
			},
		}, <RoundingColumnDef<IMaterialPriceConditionEntity>>{
			id: 'Total',
			model: 'Total',
			type: FieldType.Decimal,
			sortable: true,
			roundingField: 'MdcPriceCondition_Total',
			formatterOptions: {
				decimalPlaces: 4
			},
		}];


		roundingService.lookUpRoundingConfig(gridConfiguration);
		expect(gridConfiguration.columns).toEqual(expectedGridConfiguration);
	});

	afterAll(() => {
		httpMock.verify();
	});

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
				RoundToFk: 2,
				RoundingMethodFk: 1,
				Sorting: 1,
				UiDisplayTo: 5
			},
			{
				ColumnId: 2,
				Id: 1000019,
				IsWithoutRounding: false,
				RoundTo: 3,
				RoundToFk: 2,
				RoundingMethodFk: 2,
				Sorting: 2,
				UiDisplayTo: 4
			}, {
				ColumnId: 3,
				Id: 1000020,
				IsWithoutRounding: false,
				RoundTo: 3,
				RoundToFk: 2,
				RoundingMethodFk: 3,
				Sorting: 3,
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
			MdcPriceCondition_TotalOc: 1,
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
			Total: 1,
			TotalCallOffQuantity: 1,
			TotalCurrency: 3,
			TotalCurrencyNoDiscount: 3,
			TotalDelivered: 3,
			TotalGross: 3,
			TotalGrossOc: 3,
			TotalNoDiscount: 3,
			TotalOc: 5,
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
			Value: 3,
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
});