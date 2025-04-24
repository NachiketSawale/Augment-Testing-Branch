/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ControllingRevenueRecognitionAccrualDataService } from './revenue-recognition-accrual-data.service';
import { ControllingRevenueRecognitionAccrualLayoutService } from './revenue-recognition-accrual-layout.service';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';

export const REVENUE_RECOGNITION_ACCRUAL_ENTITY_INFO = EntityInfo.create<ICompanyTransactionEntity>({
	dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyTransactionDto'},
	permissionUuid: '37e35f1b9e914b24802ca6e4a3a99a5c',
	grid: {
		title: {text: 'Accruals', key: 'controlling.revrecognition.accrualListTitle'}
	},
	form: {
		title: {text: 'Accrual Detail', key: 'controlling.revrecognition.accrualDetailTitle'},
		containerUuid: '3c6d7949d9e84ee385b3d58e7672975c'
	},
	dataService: ctx => ctx.injector.get(ControllingRevenueRecognitionAccrualDataService),
	layoutConfiguration: context => {
		return context.injector.get(ControllingRevenueRecognitionAccrualLayoutService).generateLayout();
	}
});
