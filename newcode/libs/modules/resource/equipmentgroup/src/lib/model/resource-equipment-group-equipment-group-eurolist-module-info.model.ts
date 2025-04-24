/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EquipmentGroupEurolistDataService } from '../services/equipment-group-eurolist-data.service';
import { EquipmentGroupEurolistValidationService } from '../services/equipment-group-eurolist-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IEquipmentGroupEurolistEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ResourceSharedLookupOverloadProvider } from "@libs/resource/shared";

export const resourceEquipmentGroupEquipmentGroupEurolistModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupEuroListListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupEuroListDetailTitle'
		},
		containerUuid: '9c0779eb4dc7426988ca468f8bde4daa'
	},
	dataService: (ctx) => ctx.injector.get(EquipmentGroupEurolistDataService),
	validationService: (ctx) => ctx.injector.get(EquipmentGroupEurolistValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'EquipmentGroupEurolistDto'
	},
	permissionUuid: 'c686905455cf458fb299c40e0966c5b8',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'PlantGroupFk',
					'CatalogFk',
					'CatalogRecordFk',
					'Quantity',
					'UoMFk',
					'IsTire',
					'IsInterpolated',
					'IsManual',
					'Lookupcode',
					'Reinstallment',
					'Reinstallmentyear',
					'Deviceparameter1',
					'Deviceparameter2',
					'Description',
					'CatalogRecordLowerFk',
					'CatalogRecordUpperFk',
					'DepreciationLowerFrom',
					'DepreciationLowerTo',
					'DepreciationUpperFrom',
					'DepreciationUpperTo',
					'DepreciationPercentFrom',
					'DepreciationPercentTo',
					'Depreciation',
					'RepairUpper',
					'RepairLower',
					'RepairPercent',
					'RepairCalculated',
					'ReinstallmentLower',
					'ReinstallmentUpper',
					'ReinstallmentCalculated',
					'PriceIndexCalc',
					'PriceIndexLower',
					'PriceIndexUpper',
					'IsExtrapolated',
					'Code',
					'GroupEurolistFk',
				]
			},
		],
		overloads: {
			CatalogFk: ResourceSharedLookupOverloadProvider.provideResourceCatalogLookupOverload(false),
			CatalogRecordFk: ResourceSharedLookupOverloadProvider.provideResourceCatalogRecordLookupOverload(false),
			CatalogRecordLowerFk: ResourceSharedLookupOverloadProvider.provideResourceCatalogRecordLookupOverload(true),
			CatalogRecordUpperFk: ResourceSharedLookupOverloadProvider.provideResourceCatalogRecordLookupOverload(true),
			UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			GroupEurolistFk: ResourceSharedLookupOverloadProvider.provideEquipmentGroupEurolistLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' },
				CatalogFk: { key: 'entityCatalog' },
				CatalogRecordFk: { key: 'entityCatalogRecord' },
				UoMFk: { key: 'entityUoM' },
				IsTire: { key: 'entityIsTire' },
				IsInterpolated: { key: 'entityIsInterpolated' },
				Lookupcode: { key: 'entityLookupCode' },
				Reinstallment: { key: 'entityReinstatement' },
				Reinstallmentyear: { key: 'entityReinstatementYear' },
				Deviceparameter1: { key: 'entityDeviceParameter1' },
				Deviceparameter2: { key: 'entityDeviceParameter2' },
				CatalogRecordLowerFk: { key: 'entityCatalogRecordLower' },
				CatalogRecordUpperFk: { key: 'entityCatalogRecordUpper' },
				DepreciationLowerFrom: { key: 'entityDepreciationLowerFrom' },
				DepreciationLowerTo: { key: 'entityDepreciationLowerTo' },
				DepreciationUpperFrom: { key: 'entityDepreciationUpperFrom' },
				DepreciationUpperTo: { key: 'entityDepreciationUpperTo' },
				DepreciationPercentFrom: { key: 'entityDepreciationPercentFrom' },
				DepreciationPercentTo: { key: 'entityDepreciationPercentTo' },
				Depreciation: { key: 'entityDepreciation' },
				RepairUpper: { key: 'entityRepairUpper' },
				RepairLower: { key: 'entityRepairLower' },
				RepairPercent: { key: 'entityRepairPercent' },
				RepairCalculated: { key: 'entityRepairCalculated' },
				ReinstallmentLower: { key: 'entityReinstallmentLower' },
				ReinstallmentUpper: { key: 'entityReinstallmentUpper' },
				ReinstallmentCalculated: { key: 'entityReinstallmentCalculated' },
				PriceIndexCalc: { key: 'entityPriceIndexCalc' },
				PriceIndexLower: { key: 'entityPriceIndexLower' },
				PriceIndexUpper: { key: 'entityPriceIndexUpper' },
				IsExtrapolated: { key: 'entityIsExtrapolated' },
				GroupEurolistFk: { key: 'entityGroupEurolistFk' }
			}),
			...prefixAllTranslationKeys('resource.equipment.', {
				Quantity: { key: 'entityItemQuantity' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				IsManual: { key: 'isManual' },
				Code: { key: 'costCode' }
			}),
			...prefixAllTranslationKeys('resource.common.', {
				Description: { key: 'plantDescription' }
			}),
		}
	}
} as IEntityInfo<IEquipmentGroupEurolistEntity>);