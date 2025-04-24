/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PlantGroup2CostCodeDataService } from '../services/plant-group-2-cost-code-data.service';
import { PlantGroup2CostCodeValidationService } from '../services/plant-group-2-cost-code-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IPlantGroup2CostCodeEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const resourceEquipmentGroupPlantGroup2CostCodeModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.plantGroup2CostCodeList'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.plantGroup2CostCodeDetail'
		},
		containerUuid: 'c622ef8ecbe34fea947b6f8b439e3d41'
	},
	dataService: (ctx) => ctx.injector.get(PlantGroup2CostCodeDataService),
	validationService: (ctx) => ctx.injector.get(PlantGroup2CostCodeValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'PlantGroup2CostCodeDto'
	},
	permissionUuid: 'bc1f044294f9419db99e41c2bd14e1bf',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'CostCodePriceP1Fk',
					'CostCodePriceP2Fk',
					'CostCodePriceP3Fk',
					'CostCodePriceP4Fk',
					'CostCodePriceP5Fk',
					'CostCodePriceP6Fk',
					'CommentText',
					'MdcContextFk',
				]
			},
		],
		overloads: {
			CostCodePriceP1Fk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
			CostCodePriceP2Fk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
			CostCodePriceP3Fk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
			CostCodePriceP4Fk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
			CostCodePriceP5Fk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
			CostCodePriceP6Fk: BasicsSharedLookupOverloadProvider.provideCostCodeLookupOverload(true),
			MdcContextFk: BasicsSharedLookupOverloadProvider.provideMasterDataContextLookupOverload(false)
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' },
				CostCodePriceP1Fk: { key: 'entityCostCodePriceP1' },
				CostCodePriceP2Fk: { key: 'entityCostCodePriceP2' },
				CostCodePriceP3Fk: { key: 'entityCostCodePriceP3' },
				CostCodePriceP4Fk: { key: 'entityCostCodePriceP4' },
				CostCodePriceP5Fk: { key: 'entityCostCodePriceP5' },
				CostCodePriceP6Fk: { key: 'entityCostCodePriceP6' },
				MdcContextFk: { key: 'entityMdcContext' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: { key: 'entityComment' }
			}),
		}
	}
} as IEntityInfo<IPlantGroup2CostCodeEntity>);