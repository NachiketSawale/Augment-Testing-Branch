/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateAssembliesService } from './estimate-assemblies-data.service';
import { EstimateAssembliesLayoutService } from './estimate-assemblies-layout.service';
import { EstimateAssembliesBehaviorService } from './estimate-assemblies-behavior.service';
import {
	EstimateAssembliesBaseValidationService
} from '@libs/estimate/shared';
import { runInInjectionContext } from '@angular/core';

/**
 * Basics Assemblies Entity Info
 */
export const ESTIMATE_ASSEMBLIES_ENTITY_INFO = EntityInfo.create<IEstLineItemEntity>({
	grid: {
		containerUuid:'b5c6ff9eab304beba4335d30700773da',
		title: { text: 'Assemblies', key: 'estimate.assemblies.containers.assemblies' },
		behavior:ctx => ctx.injector.get(EstimateAssembliesBehaviorService),
	},
	form: {
		containerUuid: '234BB8C70FD9411299832DCCE38ED118',
		title: { text: 'Assemblies', key: 'estimate.assemblies.containers.assemblies' },
	},
	dataService: ctx => ctx.injector.get(EstimateAssembliesService),
	validationService: context => {
		const assembliesService = context.injector.get(EstimateAssembliesService);
		return runInInjectionContext(context.injector, () => {
			return new EstimateAssembliesBaseValidationService(assembliesService);
		});
	},
	dtoSchemeId: { moduleSubModule: 'Estimate.Assemblies', typeName: 'EstLineItemDto' },
	permissionUuid: '234BB8C70FD9411299832DCCE38ED118',
	layoutConfiguration: context => {
		return context.injector.get(EstimateAssembliesLayoutService).generateLayout();
	}
});