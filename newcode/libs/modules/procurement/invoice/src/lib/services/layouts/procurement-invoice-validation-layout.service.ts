/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IInvValidationEntity } from '../../model';
import { ProcurementInvoiceValidationsMessageLookupComponent } from '../../components/procurement-invoice-validations-message-lookup/procurement-invoice-validations-message-lookup.component';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Represents the Layout service to handle Procurement Invoice Validation Layout Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceValidationLayoutService {
	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IInvValidationEntity>> {
		return {
			groups: [{ gid: 'invoiceValidation', attributes: ['MessageseverityFk', 'ReferenceType', 'Message'] }],
			labels: {
				...prefixAllTranslationKeys('basics.customize.', {
					MessageseverityFk: { key: 'messageseverityfk' },
				}),
				...prefixAllTranslationKeys('procurement.invoice.', {
					ReferenceType: { key: 'referenceType' },
					Message: { key: 'message' },
				}),
			},
			overloads: {
				ReferenceType: {
					readonly: true,
					//Todo:simplelookup is pending due to api call return null value of reference
				},
				MessageseverityFk:BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceStatusLookupOverload(false),
				Message: {
					type: FieldType.CustomComponent,
					componentType: ProcurementInvoiceValidationsMessageLookupComponent,
				},
			},
		};
	}
}
