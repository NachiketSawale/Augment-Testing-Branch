/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IBoqWic2assemblyEntity } from '@libs/boq/interfaces';
import { EstimateMainAssemblyRelateDataService } from './estimate-main-assembly-relate-data.service';
import { EstimateMainAssemblyRelateBehavior } from './estimate-main-assembly-relate-behavior.service';
import { EstimateMainAssemblyRelateLayoutService } from './estimate-main-assembly-relate-layout.service';

/**
 * Estimate Total Entity Info
 */
export const ESTIMATE_MAIN_ASSEMBLY_RELATE_ENTITY_INFO = EntityInfo.create<IBoqWic2assemblyEntity>({
	grid: {
		title: { text: 'Related Assemblies', key: 'estimate.main.assemblyRelatedWic' },
		containerUuid: '23572CA132F44B9E8269B39002C2908B',
	},
	dataService: (ctx) => ctx.injector.get(EstimateMainAssemblyRelateDataService),
	dtoSchemeId: { typeName: 'BoqWic2assemblyDto', moduleSubModule: 'Boq.Main' },
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	layoutConfiguration: (ctx) => ctx.injector.get(EstimateMainAssemblyRelateLayoutService).generateLayout(),
	containerBehavior: (ctx) => ctx.injector.get(EstimateMainAssemblyRelateBehavior),
});
