/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { ConstructionSystemMasterAssemblyResourceDataService } from '../../services/construction-system-master-assembly-resource-data.service';
import { ConstructionSystemMasterAssemblyResourceLayoutService } from '../../services/layouts/construction-system-master-assembly-resource-layout.service';

/**
 * Cos Master Assembly Resource Entity Info
 */
export const CONSTRUCTION_SYSTEM_MASTER_ASSEMBLY_RESOURCE_ENTITY_INFO = EntityInfo.create<IEstResourceEntity>({
	grid: {
		title: { text: 'Assembly Resource', key: 'constructionsystem.master.assemblyResourceGridContainerTitle' },
		containerUuid: '574b34f0674d450ca9c696d9bd5c4ea7'
	},
	dataService: ctx => ctx.injector.get(ConstructionSystemMasterAssemblyResourceDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstResourceDto' },
	permissionUuid: '12ed89f703f9484d8934a967da15bbe4',
	layoutConfiguration: context => {
		return context.injector.get(ConstructionSystemMasterAssemblyResourceLayoutService).generateLayout();
	}
});