/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEntitySchema, PlatformSchemaService } from '@libs/platform/data-access';
import { IInitializationContext, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMasterResourceDataService } from '../../services/construction-system-master-resource-data.service';
import { ConstructionSystemMasterResourceValidationService } from '../../services/validations/construction-system-master-resource-validation.service';
import { ConstructionSystemMasterResourceLayoutService } from '../../services/layouts/construction-system-master-resource-layout.service';

export const CONSTRUCTION_SYSTEM_MASTER_RESOURCE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstResourceEntity>({
	grid: {
		title: { key: 'constructionsystem.master.resourceContainerTitle' },
		treeConfiguration: true,
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterResourceDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterResourceValidationService),
	layoutConfiguration: (ctx) => ctx.injector.get(ConstructionSystemMasterResourceLayoutService).generateLayout(),
	entitySchema: ServiceLocator.injector.get(ConstructionSystemMasterResourceLayoutService).getEntitySchema(),
	prepareEntityContainer: async (ctx: IInitializationContext) => {
		const schemaService = ctx.injector.get(PlatformSchemaService);
		const schema: IEntitySchema<IEstResourceEntity> = await schemaService.getSchema({ moduleSubModule: 'Estimate.Main', typeName: 'EstResourceDto' });
		ctx.injector.get(ConstructionSystemMasterResourceLayoutService).setEntitySchema(schema);
	},
	permissionUuid: '31c33108b9c4455692b3e443d5b60224',
});
