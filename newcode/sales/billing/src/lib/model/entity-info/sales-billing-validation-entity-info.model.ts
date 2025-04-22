/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { SalesBillingValidationDataService } from '../../services/sales-billing-validation-data.service';
import { IValidationEntity } from '@libs/sales/interfaces';

export const SALES_BILLING_VALIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IValidationEntity>({
	grid: {
		title: {key: 'sales.billing.containerTitleValidation'},
	},
	form: {
		title: {key: 'sales.billing.containerTitleValidationDetail'},
		containerUuid: '381859cb3a9e46829179bfc91d11af89'
	},
	dataService: ctx => ctx.injector.get(SalesBillingValidationDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Billing', typeName: 'ValidationDto'},
	permissionUuid: '1247ef00dfce413793b328f685f7ca27',
	layoutConfiguration: {
		groups: [
			{gid: 'Basic Data', attributes: ['MessageseverityFk', 'Message']},
		],
		labels: {
			...prefixAllTranslationKeys('basics.customize.', {
				MessageseverityFk: {key: 'messageseverityfk', text: 'Message Severity'}
			})
		},
		overloads: {
			MessageseverityFk: BasicsSharedCustomizeLookupOverloadProvider.provideMessageSeverityLookupOverload(false),
			Message: { label: { text: 'Message', key: 'message' }, visible: true }
		}
	}
});