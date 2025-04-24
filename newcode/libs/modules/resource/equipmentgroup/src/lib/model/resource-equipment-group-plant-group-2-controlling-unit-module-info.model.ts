/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PlantGroup2ControllingUnitDataService } from '../services/plant-group-2-controlling-unit-data.service';
import { PlantGroup2ControllingUnitValidationService } from '../services/plant-group-2-controlling-unit-validation.service';
import { IEntityInfo, EntityInfo } from '@libs/ui/business-base';
import { IPlantGroup2ControllingUnitEntity } from '@libs/resource/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';

export const resourceEquipmentGroupPlantGroup2ControllingUnitModuleInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupControllingUnitListTitle'
		}
	},
	form: {
		title: {
			text: '',
			key: 'resource.equipmentgroup.equipmentGroupControllingUnitDetailTitle'
		},
		containerUuid: 'a2190511a5de424e9f5514ac574ea0eb'
	},
	dataService: (ctx) => ctx.injector.get(PlantGroup2ControllingUnitDataService),
	validationService: (ctx) => ctx.injector.get(PlantGroup2ControllingUnitValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.EquipmentGroup',
		typeName: 'PlantGroup2ControllingUnitDto'
	},
	permissionUuid: '91b78b592b5548cea31092fe04ed94bf',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: [
					'ProjectContextFk',
					'ProjectFk',
					'ControllingUnitFk',
					'Comment',
				]
			},
		],
		overloads: {
			ProjectContextFk: BasicsSharedLookupOverloadProvider.provideProjectContextLookupOverload(false),
			ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectLookupOverload(false)
			// ToDo ControllingUnitFk
		},
		labels: {
			...prefixAllTranslationKeys('resource.equipmentgroup.', {
				PlantGroupFk: { key: 'entityPlantGroup' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				ProjectContextFk: { key: 'projectcontext' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				ProjectFk: { key: 'entityProject' },
				ControllingUnitFk: { key: 'entityControllingUnit' },
				Comment: { key: 'entityComment' }
			}),
		}
	}
} as IEntityInfo<IPlantGroup2ControllingUnitEntity>);