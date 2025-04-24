/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMainObject2LocationDataService } from '../../services/construction-system-main-object2-location-data.service';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { IModelObject2LocationEntity } from '../entities/model-object2-location-entity.interface';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { ConstructionSystemMainInstanceDataService } from '../../services/construction-system-main-instance-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_OBJECT2_LOCATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelObject2LocationEntity>({
	grid: {
		title: { key: 'model.main.modelObject2LocationListTitle' },
	},
	form: {
		title: { key: 'constructionsystem.main.model.main.modelObject2LocationDetailTitle' },
		containerUuid: 'fb85f0b7f13043c0a9058e934d79365d',
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainObject2LocationDataService),
	dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ModelObject2LocationDto' },
	permissionUuid: 'f46d660558a7438fb2cc8014f00f00b4',
	prepareEntityContainer: async (ctx) => {
		const locationLookupService = ctx.injector.get(ProjectLocationLookupService); // check it is smaller
		await Promise.all([locationLookupService.getList()]);
	},
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['LocationFk'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('model.main.', {
				LocationFk: { key: 'entityLocation', text: 'Location' },
			}),
		},
		overloads: {
			LocationFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectLocationLookupService,
					showClearButton: true,
					serverSideFilter: {
						key: '',
						execute() {
							const instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
							return {
								ProjectId: instanceService.getCurrentSelectedProjectId(),
							};
						},
					},
				}),
			},
		},
	},
});
