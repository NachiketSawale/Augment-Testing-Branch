/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainLineItemValidationService } from './estimate-main-line-item-validation.service';
import { EstimateMainLineItemLayoutService } from './estimate-main-line-item-layout.service';
import { EstimateMainLineItemBehaviorService } from './estimate-main-line-item-behavior.service';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';

/**
 * Estimate Line Item Entity Info
 */
export const ESTIMATE_LINE_ITEM_ENTITY_INFO = EntityInfo.create<IEstLineItemEntity>({
	grid: {
		title: { text: 'Line Items', key: 'estimate.main.lineItemContainer' },
		containerUuid: '681223e37d524ce0b9bfa2294e18d650',
	},
	form: {
		containerUuid: 'e1956964883749dfa7cf4207d1eb3b50',
		title: { text: 'Line Items Details', key: 'estimate.main.lineItemsDetails' }
	},
	dataService: ctx => ctx.injector.get(EstimateMainService),
	validationService: context => context.injector.get(EstimateMainLineItemValidationService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstLineItemDto' },
	permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
	layoutConfiguration: context => {
		return context.injector.get(EstimateMainLineItemLayoutService).generateLayout();
	},
	containerBehavior:ctx => ctx.injector.get(EstimateMainLineItemBehaviorService)
});