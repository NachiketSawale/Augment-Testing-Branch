/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceCatalogRecordEntity } from '@libs/resource/interfaces';
import { ResourceCatalogRecordBehavior } from '../behaviors/resource-catalog-record-behavior.service';
import { ResourceCatalogRecordDataService } from '../services/resource-catalog-record-data.service';

export const RESOURCE_CATALOG_RECORD_ENTITY_INFO: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'resource.catalog.recordListTitle'},
		behavior: (ctx) => ctx.injector.get(ResourceCatalogRecordBehavior),
	},
	form: {
		title: {key: 'resource.catalog.recordDetailTitle'},
		containerUuid: 'b6d25f959003460cbf03529c91ad5894'
	},
	dataService: (ctx) => ctx.injector.get(ResourceCatalogRecordDataService),
	dtoSchemeId: {moduleSubModule: 'Resource.Catalog', typeName: 'CatalogRecordDto'},
	permissionUuid: 'bae34453f83744d3a6f7e53b7851e657',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['Code', 'Description', 'Specification', 'Equipment', 'Consumable', 'With', 'Without'],
			}, {
				gid: 'Characteristics',
				attributes: ['Characteristic1','UoM1Fk','CharacteristicValue1', 'Characteristic2','UoM2Fk','CharacteristicValue2',
					'CharacteristicContent1','CharacterValueType1Fk','CharacteristicContent2','CharacterValueType2Fk','CatalogCodeContentFk']
			}, {
				gid: 'Measures',
				attributes: ['MeasureA','UoMAFk','MeasureValueA', 'MeasureB','UoMBFk','MeasureValueB', 'MeasureC','UoMCFk','MeasureValueC',
					'MeasureD','UoMDFk','MeasureValueD', 'MeasureE','UoMEFk','MeasureValueE']
			}, {
				gid: 'Configuration',
				attributes: ['Weight','MachineLive','OperationMonthsFrom','OperationMonthsTo','MonthlyRepair','Flag','ValueNew',
					'WeightPercent','Reinstallment','ReinstallmentPercent','MonthlyRepairValue','ProducerPriceIndex']
			}, {
				gid: 'DepreciationInterest',
				attributes: ['MonthlyFactorDepreciationInterestFrom','MonthlyFactorDepreciationInterestTo','MonthlyFactorDepreciationInterestValueFrom',
					'MonthlyFactorDepreciationInterestValueTo']
			}
		],
		overloads: {
			CatalogCodeContentFk: BasicsSharedLookupOverloadProvider.provideEquipmentCatalogCodeContentLookupOverload(true),
			CharacterValueType1Fk: BasicsSharedLookupOverloadProvider.provideEquipmentCharacterValueTypeLookupOverload(true),
			CharacterValueType2Fk: BasicsSharedLookupOverloadProvider.provideEquipmentCharacterValueTypeLookupOverload(true),
			UoM1Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UoM2Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UoMAFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UoMBFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UoMCFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UoMDFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			UoMEFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('resource.catalog.', {
				Equipment: {key: 'detEquipment'},
				Consumable: {key: 'detConsumable'},
				With: {key: 'entityWith'},
				Without: {key: 'entityWithout'},
				Characteristic1: { key: 'detChar1'},
				UoM1Fk: { key: 'detUoM1'},
				CharacteristicValue1: { key: 'detCharVal1'},
				Characteristic2: { key: 'detChar2'},
				UoM2Fk: { key: 'detUoM2'},
				CharacteristicValue2: { key: 'detCharVal2'},
				CatalogCodeContentFk: { key: 'catalogCodeContent'},
				CharacteristicContent1: { key: 'characteristicContent1'},
				CharacterValueType1Fk: { key: 'characterValueType1Fk'},
				CharacteristicContent2: { key: 'characteristicContent2'},
				CharacterValueType2Fk: { key: 'characterValueType2Fk'},
				MeasureA: { key: 'detMeasureA'},
				UoMAFk: { key: 'detUoMA'},
				MeasureValueA: { key: 'detMeasValA'},
				MeasureB: { key: 'detMeasureB'},
				UoMBFk: { key: 'detUoMB'},
				MeasureValueB: { key: 'detMeasValB'},
				MeasureC: { key: 'detMeasureC'},
				UoMCFk: { key: 'detUoMC'},
				MeasureValueC: { key: 'detMeasValC'},
				MeasureD: { key: 'detMeasureD'},
				UoMDFk: { key: 'detUoMD'},
				MeasureValueD: { key: 'detMeasValD'},
				MeasureE: { key: 'detMeasureE'},
				UoMEFk: { key: 'detUoME'},
				MeasureValueE: { key: 'detMeasValE'},
				Weight: { key: 'detWeight'},
				MachineLive: { key: 'detMachineLive'},
				OperationMonthsFrom: { key: 'detOperationMonthsFrom'},
				OperationMonthsTo: { key: 'detOperationMonthsTo'},
				MonthlyRepair: { key: 'detMonthlyRepair'},
				Flag: { key: 'detFlag'},
				ValueNew: { key: 'detValueNew'},
				WeightPercent: { key: 'detWeightPercent'},
				Reinstallment: { key: 'detReinstallment'},
				ReinstallmentPercent: { key: 'detReinstallmentPercent'},
				MonthlyRepairValue: { key: 'detMonthlyRepairValue'},
				MonthlyFactorDepreciationInterestFrom: { key: 'detMonthlyFactorDIFrom'},
				MonthlyFactorDepreciationInterestTo: { key: 'detMonthlyFactorDITo'},
				MonthlyFactorDepreciationInterestValueFrom: { key: 'detMonthlyFactorDIValueFrom'},
				MonthlyFactorDepreciationInterestValueTo: { key: 'detMonthlyFactorDIValueTo'},
				ProducerPriceIndex: { key: 'detProducerPriceIndex'},
				Measures: { key: 'entityMeasures'},
				Configuration: { key: 'entityConfiguration'},
				DepreciationInterest: { key: 'entityDepreciationInterest'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				basicData: {key: 'entityProperties'},
				Code: {key: 'entityCode'},
				Description: {key: 'entityDescription'},
				Specification: {key: 'EntitySpec'},
				Characteristics: {key: 'ContainerCharacteristicDefaultTitle'}
			})
		}
	}
} as IEntityInfo<IResourceCatalogRecordEntity>);