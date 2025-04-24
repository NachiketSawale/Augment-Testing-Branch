/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainManagedPlantLocDataService } from '../services/project-main-managed-plant-loc-data.service';
import { IManagedPlantLocVEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { ProjectMainManagedPlantLocBehavior } from '../behaviors/project-main-managed-plant-loc-behavior.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export const PROJECT_MAIN_MANAGED_PLANT_LOC_ENTITY_INFO: EntityInfo = EntityInfo.create<IManagedPlantLocVEntity>({
	grid: {
		title: {key: 'project.main' + '.listManagedPlantLocTitle'},
		behavior: ctx => ctx.injector.get(ProjectMainManagedPlantLocBehavior),
	},
	form: {
		title: {key: 'project.main' + '.detailManagedPlantLocTitle'},
		containerUuid: '6ff893e4f04448d38552f2e3678e2c25',
	},
	dataService: ctx => ctx.injector.get(ProjectMainManagedPlantLocDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ManagedPlantLocVDto'},
	permissionUuid: 'dc5f95a4f8c143a8ae0b2521a83d4e19',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['PlantFk', 'Quantity', 'WorkOperationTypeFk', 'JobFk', 'DispatchHeaderInFk', 'SerialNumber', 'TrafficLightFk', 'PlantTypeFk',
				'PlantComponentTypeFk', 'PlantGroupFk']}
		],
		overloads: {
			// TODO: PlantFk, JobFk, DispatchHeaderInFk, PlantComponentTypeFk, PlantGroupFk lookup overloads
			WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeReadonlyLookupOverload(),
			TrafficLightFk: BasicsSharedCustomizeLookupOverloadProvider.provideResourceTrafficLightReadonlyLookupOverload(),
			PlantTypeFk: BasicsSharedLookupOverloadProvider.providePlantTypeReadonlyLookupOverload(),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.',{
				Quantity: {key: 'entityQuantity'},
			}),
			...prefixAllTranslationKeys('resource.equipment.',{
				PlantFk: { key: 'entityPlant'},
				WorkOperationTypeFk: { key: 'entityWorkOperationTypeFk'},
				DispatchHeaderInFk: { key: 'entityDispatchHeaderInFk'},
				SerialNumber: { key: 'entitySerialNumber'},
				TrafficLightFk: { key: 'trafficlight'},
				PlantTypeFk: { key: 'planttype'},
				PlantComponentTypeFk: { key: 'entityPlantComponentTypeFk'},
				PlantGroupFk: { key: 'entityResourceEquipmentGroup'},
			}),
			...prefixAllTranslationKeys('logistic.job.', {
				JobFk: {key: 'entityJob'},
			}),
		}
	},

});