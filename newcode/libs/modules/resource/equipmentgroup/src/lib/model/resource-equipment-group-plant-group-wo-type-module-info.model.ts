/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PlantGroupWoTypeDataService } from '../services/plant-group-wo-type-data.service';
import { PlantGroupWoTypeValidationService } from '../services/plant-group-wo-type-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IPlantGroupWoTypeEntity } from '@libs/resource/interfaces';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';

export const resourceEquipmentGroupPlantGroupWoTypeModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupWorkOrderTypeListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupWorkOrderTypeDetailTitle'
		},
		containerUuid: '9355d63a6f0b4b9991f3e1f8532ceb4'
	},
	dataService: (ctx) => ctx.injector.get(PlantGroupWoTypeDataService),
	validationService: (ctx) => ctx.injector.get(PlantGroupWoTypeValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'PlantGroupWoTypeDto'
	},
	permissionUuid: 'd7a7913fcf27457eb7db277790b7812e',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'WorkOperationTypeFk',
					'IsPriced',
					'Percent',
				]
			},
		],
		overloads: {
			WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeLookupOverload(false)
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' },
				WorkOperationTypeFk: { key: 'entityWorkOperationTypeFk' },
				IsPriced: { key: 'entityIsPriced' },
				Percent: { key: 'entityPercent' }
			}),
		}
	}
} as IEntityInfo<IPlantGroupWoTypeEntity>);