/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ControllingRevenueRecognitionItemDataService } from './revenue-recognition-item-data.service';
import { IPrrItemEntity } from '../model/entities/prr-item-entity.interface';
import { ControllingRevenueRecognitionItemLayoutService } from './revenue-recognition-item-layout.service';
import { ControllingRevenueRecognitionItemBehavior } from './revenue-recognition-item-behavior.service';
import { ControllingRevenueRecognitionItemValidationService } from './revenue-recognition-item-validation.service';

export const REVENUE_RECOGNITION_ITEM_ENTITY_INFO = EntityInfo.create<IPrrItemEntity>({
	dtoSchemeId: {moduleSubModule: 'Controlling.RevRecognition', typeName: 'PrrItemDto'},
	permissionUuid: '0cbab2c461504ccd82a484542f9ea130',
	idProperty: 'Idx',
	grid: {
		title: {text: 'Revenue Recognition Item', key: 'controlling.revrecognition.progressReportItemListTitle'},
		treeConfiguration: true
	},
	form: {
		title: {text: 'Revenue Recognition Item Detail', key: 'controlling.revrecognition.progressReportItemDetailTitle'},
		containerUuid: '6e5e80f15f88432ca3f19515519a1ee1'
	},
	containerBehavior: ctx => ctx.injector.get(ControllingRevenueRecognitionItemBehavior),
	validationService: ctx => ctx.injector.get(ControllingRevenueRecognitionItemValidationService),
	dataService: ctx => ctx.injector.get(ControllingRevenueRecognitionItemDataService),
	layoutConfiguration: context => {
		return context.injector.get(ControllingRevenueRecognitionItemLayoutService).generateLayout();
	}
});
