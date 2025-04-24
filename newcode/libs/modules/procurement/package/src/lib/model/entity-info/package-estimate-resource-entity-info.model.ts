/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IPackageEstimateResourceEntity} from '../entities/package-estimate-resource-entity.interface';
import {ProcurementPackageEstimateResourceDataService} from '../../services/package-estimate-resource-data.service';
import {
	ProcurementPackageEstimateResourceLayoutService
} from '../../services/layout-services/package-estimate-resource-layout.service';

export const PROCUREMENT_PACKAGE_ESTIMATE_RESOURCE_ENTITY_INFO = EntityInfo.create<IPackageEstimateResourceEntity>({
	grid: {
		title: 'procurement.package.estimateResourceGridContainerTitle'
	},
	permissionUuid: '691df3bc90574be182ed007600a15d44',
	dataService: (ctx) => ctx.injector.get(ProcurementPackageEstimateResourceDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstResourceDto' },
	layoutConfiguration: (ctx) => {
		return ctx.injector.get(ProcurementPackageEstimateResourceLayoutService).generateLayout();
	},
});