/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IWipValidationEntity } from '../entities/wip-validation-entity.interface';
import { SalesWipValidationDataService } from '../../services/sales-wip-validation-data.service';


export const SALES_WIP_VALIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IWipValidationEntity>({
	grid: {
		title: {key: 'Validation'}, // TODO: Need to add the translation here once sales.billing module available
	},
	form: {
		title: {key: 'Validation Details'},// TODO: Need to add the translation here once sales.billing module available
		containerUuid: '8878767fced80b69f7e83d6224196a3a'
	},
	dataService: ctx => ctx.injector.get(SalesWipValidationDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Wip', typeName: 'WipValidationDto'},
	permissionUuid: '67a37d7e33e92a21961b51848a378c5f',
	layoutConfiguration: {
		groups: [
			{gid: 'Basic Data', attributes: ['MessageseverityFk', 'Message']},
		],
		overloads: {
			MessageseverityFk: BasicsSharedCustomizeLookupOverloadProvider.provideMessageSeverityReadonlyLookupOverload(),
			Message: { label: { text: 'Message', key: 'Message' }, visible: true,readonly:true }
		},
		labels: {
			...prefixAllTranslationKeys('sales.wip.', {
				MessageseverityFk: {key: 'entityMessageseverityFk'},
				Message: {key: 'entityMessage'}
			}),
		},
	}
});