/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IPackageEstimateLineItemEntity} from '../entities/package-estimate-line-item-entity.interface';
import {ProcurementPackageEstimateLineItemDataService} from '../../services/package-estimate-line-item-data.service';
import {
	ProcurementPackageEstimateLineItemLayoutService
} from '../../services/layout-services/package-estimate-line-item-layout.service';
import {
	ProcurementPackageEstimateLineItemBehaviorService
} from '../../behaviors/package-estimate-line-item-behavior.service';

export const PROCUREMENT_PACKAGE_ESTIMATE_LINE_ITEM_ENTITY_INFO = EntityInfo.create<IPackageEstimateLineItemEntity>({
	grid: {
		title: 'procurement.package.estimateLineItemGridContainerTitle'
	},
	permissionUuid: '067be143d76d4ad080660ef147349f1d',
	dataService: (ctx) => ctx.injector.get(ProcurementPackageEstimateLineItemDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstLineItemDto' },
	layoutConfiguration: (ctx) => {
		return ctx.injector.get(ProcurementPackageEstimateLineItemLayoutService).generateLayout();
	},
	containerBehavior: (ctx) => ctx.injector.get(ProcurementPackageEstimateLineItemBehaviorService)
});