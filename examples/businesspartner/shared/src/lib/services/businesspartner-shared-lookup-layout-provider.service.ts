/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedLookupLayoutService, ILookupLayoutConfig } from '@libs/basics/shared';
import { IContactLookupEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerSharedContactLookupService } from '../lookup-services';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { Injectable, inject } from '@angular/core';

/**
 * A shared lookup layout service to deal with lookup fields in container layout.
 */
@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerSharedLookupLayoutProvider {
	private readonly lookupLayoutService = inject(BasicsSharedLookupLayoutService);

	public provideContactLookupFields<T extends object>(containerLayout: ILayoutConfiguration<T>, config: ILookupLayoutConfig<T>) {
		this.lookupLayoutService.appendLookupFieldsIntoLayout<T, IContactLookupEntity>(containerLayout, {
			...config,
			lookupService: BusinesspartnerSharedContactLookupService,
			lookupFields: [
				{
					id: 'ContactFirstName',
					lookupModel: 'FirstName',
					label: { text: 'Contact First Name', key: 'procurement.rfq.rfqBusinessPartnerContactFirstName' },
					type: FieldType.Description,
				},
				{
					id: 'ContactTitle',
					lookupModel: 'Title',
					label: { text: 'Contact Title', key: 'procurement.rfq.rfqBusinessPartnerContactTitle' },
					type: FieldType.Description,
				},
				{
					id: 'ContactTel1',
					lookupModel: 'Telephone1',
					label: { text: 'Contact Telephone 1', key: 'procurement.rfq.rfqBusinessPartnerContactTel1' },
					type: FieldType.Description,
				},
				{
					id: 'ContactTel2',
					lookupModel: 'Telephone2',
					label: { text: 'Contact Telephone 2', key: 'procurement.rfq.rfqBusinessPartnerContactTel2' },
					type: FieldType.Description,
				},
				{
					id: 'ContactFax',
					lookupModel: 'Telefax',
					label: { text: 'Contact Fax Number', key: 'procurement.rfq.rfqBusinessPartnerContactFax' },
					type: FieldType.Description,
				},
				{
					id: 'ContactMobile',
					lookupModel: 'Mobile',
					label: { text: 'Contact Mobile', key: 'procurement.rfq.rfqBusinessPartnerContactMobile' },
					type: FieldType.Description,
				},
				{
					id: 'ContactInternet',
					lookupModel: 'Internet',
					label: { text: 'Contact Internet', key: 'procurement.rfq.rfqBusinessPartnerContactInternet' },
					type: FieldType.Description,
				},
				{
					id: 'ContactEmail',
					lookupModel: 'Email',
					label: { text: 'Contact Email', key: 'procurement.rfq.rfqBusinessPartnerContactEmail' },
					type: FieldType.Email,
				},
				{
					id: 'ContactSubsidiaryDescription',
					lookupModel: 'Description',
					label: { text: 'Contact Subsidiary Description', key: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription' },
					type: FieldType.Description,
				},
				{
					id: 'ContactSubsidiaryAddress',
					lookupModel: 'AddressLine',
					label: { text: 'Contact Address', key: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress' },
					type: FieldType.Description,
				},
			],
		});
	}
}
