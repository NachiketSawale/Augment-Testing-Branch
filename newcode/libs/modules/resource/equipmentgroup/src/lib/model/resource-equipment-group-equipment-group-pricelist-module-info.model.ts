/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EquipmentGroupPricelistDataService } from '../services/equipment-group-pricelist-data.service';
import { EquipmentGroupPricelistValidationService } from '../services/equipment-group-pricelist-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IEquipmentGroupPricelistEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from "@libs/basics/shared";

export const resourceEquipmentGroupEquipmentGroupPricelistModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'equipmentGroupPriceListListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'equipmentGroupPriceListDetailTitle'
		},
		containerUuid: '1b651939c6f74c3699a9ea9391d08db0'
	},
	dataService: (ctx) => ctx.injector.get(EquipmentGroupPricelistDataService),
	validationService: (ctx) => ctx.injector.get(EquipmentGroupPricelistValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'EquipmentGroupPricelistDto'
	},
	permissionUuid: 'aac8d525517c44d794c5ddd7cf406527',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'PlantPriceListFk',
					'IsManual',
					'UomFk',
					'PricePortion01',
					'PricePortion02',
					'PricePortion03',
					'PricePortion04',
					'PricePortion05',
					'PricePortion06',
					'ValidFrom',
					'ValidTo',
					'CommentText',
				]
			},
		],
		overloads: {
			PlantPriceListFk: BasicsSharedLookupOverloadProvider.provideEquipmentPriceListLookupOverload(true),
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' },
				PlantPriceListFk: { key: 'entityPlantPriceList' },
				PricePortion01: { key: 'entityPricePortion01' },
				PricePortion02: { key: 'entityPricePortion02' },
				PricePortion03: { key: 'entityPricePortion03' },
				PricePortion04: { key: 'entityPricePortion04' },
				PricePortion05: { key: 'entityPricePortion05' },
				PricePortion06: { key: 'entityPricePortion06' },
				ValidFrom: { key: 'entityValidFrom' },
				ValidTo: { key: 'entityValidTo' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				IsManual: { key: 'isManual' },
				PricingGroupFk: { key: 'equipmentpricinggroup' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				UomFk: { key: 'entityUoM' },
				CommentText: { key: 'entityComment' }
			}),
		}
	}
} as IEntityInfo<IEquipmentGroupPricelistEntity>);