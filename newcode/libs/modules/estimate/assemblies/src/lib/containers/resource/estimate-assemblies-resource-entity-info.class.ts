/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import {
	IEstResourceEntity
} from '@libs/estimate/interfaces';
import { EstimateAssembliesService } from '../assemblies/estimate-assemblies-data.service';
import {
	EstimateAssembliesResourceBaseLayoutService
} from '@libs/estimate/shared';
import { EstimateAssembliesResourceDataService } from './estimate-assemblies-resource-data.service';
import { runInInjectionContext } from '@angular/core';
import {
	EstimateAssembliesResourceBaseValidationService
} from '@libs/estimate/shared';

/**
 * Basics Assemblies Resource Entity Info
 */
export const ESTIMATE_ASSEMBLIES_RESOURCE_ENTITY_INFO = EntityInfo.create<IEstResourceEntity>({
	grid: {
		containerUuid:'A32CE3F29BD446E097BC818F71B1263D',
		title: { text: 'Assembly Resources', key: 'estimate.assemblies.containers.assemblyResources' }
	},
	form: {
		containerUuid: '8eb36f285d154864bba7da0574973c94',
		title: { text: 'Assembly Resource Details', key: 'estimate.assemblies.containers.assemblyResourcesDetail' },
	},
	dataService: ctx => ctx.injector.get(EstimateAssembliesResourceDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstResourceDto' },
	permissionUuid: 'A32CE3F29BD446E097BC818F71B1263D',
	layoutConfiguration: context => {
		return context.injector.get(EstimateAssembliesResourceBaseLayoutService).generateLayout();
	},
	validationService: context => {
		const assembliesService = context.injector.get(EstimateAssembliesService);
		const assembliesResourceService = context.injector.get(EstimateAssembliesResourceDataService);
		return runInInjectionContext(context.injector, () => {
			return new EstimateAssembliesResourceBaseValidationService(assembliesService, assembliesResourceService);
		});
	}
});