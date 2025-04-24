/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ControllingRevenueRecognitionItemE2cLayoutService } from './revenue-recognition-e2c-layout.service';
import { ControllingRevenueRecognitionItemE2cDataService } from './revenue-recognition-e2c-data.service';
import { IPrrItemE2cEntity } from '../model/entities/prr-item-e2c-entity.interface';
import { ControllingRevenueRecognitionItemE2cValidationService } from './revenue-recognition-e2c-validation.service';
import { ControllingRevenueRecognitionItemE2cBehavior } from './revenue-recognition-e2c-behavior.service';

export const REVENUE_RECOGNITION_ITEM_E2C_ENTITY_INFO = EntityInfo.create<IPrrItemE2cEntity>({
	dtoSchemeId: {moduleSubModule: 'Controlling.RevRecognition', typeName: 'PrrItemE2cDto'},
	permissionUuid: 'c285d946758648cf88c037431179f31b',
	grid: {
		title: {text: 'Estimate to Complete', key: 'controlling.revrecognition.estimateToCompleteListTitle'},
		treeConfiguration: true,
		containerUuid: 'c285d946758648cf88c037431179f31b',
	},
	form: {
		title: {text: 'Estimate to Complete Detail', key: 'controlling.revrecognition.estimateToCompleteDetailTitle'},
		containerUuid: 'c285d946758648cf88c037431179f321'
	},
	containerBehavior: ctx => ctx.injector.get(ControllingRevenueRecognitionItemE2cBehavior),
	validationService: ctx => ctx.injector.get(ControllingRevenueRecognitionItemE2cValidationService),
	dataService: ctx => ctx.injector.get(ControllingRevenueRecognitionItemE2cDataService),
	layoutConfiguration: context => {
		return context.injector.get(ControllingRevenueRecognitionItemE2cLayoutService).generateLayout();
	}
});
