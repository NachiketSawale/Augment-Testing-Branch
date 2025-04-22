/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { SalesContractValidationDataService } from '../../services/sales-contract-validation-data.service';
import { IOrdValidationEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_VALIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrdValidationEntity>({
	grid: {
		title: {key: 'sales.billing.containerTitleValidation'},
	},
	form: {
		title: {key: 'sales.billing.containerTitleValidationDetail'},
		containerUuid: '557dd24f1cf045d89d500771789872cc'
	},
	dataService: ctx => ctx.injector.get(SalesContractValidationDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdValidationDto'},
	permissionUuid: '45ca4b671da64de799cb3a5532015ffa',
	layoutConfiguration: {
		groups: [
			{gid: 'Basic Data', attributes: ['MessageseverityFk', 'Message']},
		],
		overloads: {
			MessageseverityFk: BasicsSharedCustomizeLookupOverloadProvider.provideMessageSeverityLookupOverload(false),
			Message: { label: { text: 'Message', key: 'Message' }, visible: true }
		},
		labels: {
			...prefixAllTranslationKeys('sales.contract.', {
				MessageseverityFk: {key: 'entityMessageseverityFk'},
				Message: {key: 'entityMessage'}
			}),
		},
	}
});