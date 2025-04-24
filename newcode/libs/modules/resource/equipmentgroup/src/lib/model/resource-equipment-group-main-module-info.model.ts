/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { EquipmentGroupDataService } from '../services/equipment-group-data.service';
import { EquipmentGroupValidationService } from '../services/equipment-group-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IEquipmentGroupEntity } from '@libs/resource/interfaces';
import { ResourceSharedLookupOverloadProvider } from "@libs/resource/shared";
import { BasicsSharedLookupOverloadProvider } from "@libs/basics/shared";

export const resourceEquipmentGroupMainModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupDetailTitle'
		},
		containerUuid: '855334f9234246f5840900e646fa0a1e'
	},
	dataService: (ctx) => ctx.injector.get(EquipmentGroupDataService),
	validationService: (ctx) => ctx.injector.get(EquipmentGroupValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'EquipmentGroupDto'
	},
	permissionUuid: 'ec561557d8c14da28d7e98aa058acff9',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'Code',
					'DescriptionInfo',
					'IsLive',
					'RubricCategoryFk',
					'PricingGroupFk',
					'CommentText',
					'Specification',
					'ResTypeFk'
				]
			},
		],
		overloads: {
			RubricCategoryFk: BasicsSharedLookupOverloadProvider.provideRubricCategoryLookupOverload(false),
			PricingGroupFk: BasicsSharedLookupOverloadProvider.provideEquipmentPricingGroupLookupOverload(true),
			ResTypeFk: ResourceSharedLookupOverloadProvider.provideResourceTypeReadonlyLookupOverload()
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				EquipmentContextFk: { key: 'entityEquipmentContext' },
				EquipmentGroupFk: { key: 'entityResourceEquipmentGroup' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				PricingGroupFk: { key: 'equipmentpricinggroup' },
				ResTypeFk: { key: 'resourcetype' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode' },
				DescriptionInfo: { key: 'entityDescription' },
				IsLive: { key: 'entityIsLive' },
				RubricCategoryFk: { key: 'entityBasRubricCategoryFk' },
				CommentText: { key: 'entityComment' },
				Specification: { key: 'EntitySpec' }
			}),
		}
	}
} as IEntityInfo<IEquipmentGroupEntity>);