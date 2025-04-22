/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IAdditionalLookupField, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCommunicationChannelLookupService } from '@libs/basics/shared';
import { ITranslatable, LazyInjectable, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementSharedRfqBusinesspartnerStatusLookupService, ProcurementSharedRfqRejectionReasonLookupService } from '@libs/procurement/shared';
import { BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN } from '@libs/businesspartner/shared';
import { IRfqBusinessPartnerEntity } from '../../model/entities/rfq-businesspartner-entity.interface';
import { ProcurementRfqBusinesspartnerBusinesspartnerFilterService } from '../filters/rfq-businesspartner-businesspartner-filter.service';
import { ProcurementRfqBusinesspartnerContactFilterService } from '../filters/rfq-businesspartner-contact-filter.service';
import { ProcurementRfqBusinesspartnerSubsidiaryFilterService } from '../filters/rfq-businesspartner-subsidiary-filter.service';
import { ProcurementRfqBusinesspartnerSupplierFilterService } from '../filters/rfq-businesspartner-supplier-filter.service';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { PRC_RFQ_BUSINESS_PARTNER_LAYOUT_SERVICE, IRfqBusinessPartnerLayoutConfiguration } from '@libs/procurement/interfaces';

/**
 * Procurement layout service
 */
@Injectable({
	providedIn: 'root',
})
@LazyInjectable({
	token: PRC_RFQ_BUSINESS_PARTNER_LAYOUT_SERVICE,
	useAngularInjection: true
})
export class ProcurementRfqBusinessPartnerLayoutService implements IRfqBusinessPartnerLayoutConfiguration {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IRfqBusinessPartnerEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['FirstQuoteFrom', 'PrcCommunicationChannelFk', 'RfqBusinesspartnerStatusFk', 'DateRequested', 'RfqRejectionReasonFk', 'DateRejected', 'Comments', 'ExtendedDate', 'partialReqFk'],
				},
				{
					gid: 'businesspartnerGroup',
					title: {
						key: 'procurement.rfq.businessPartnerGroupBusinessPartner',
						text: 'BusinessPartner',
					},
					attributes: ['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk'],
				},
				{
					gid: 'contactGroup',
					title: {
						key: 'procurement.rfq.businessPartnerGroupContact',
						text: 'Contact',
					},
					attributes: ['ContactFk', 'ContactHasPortalUser'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.rfq.', {
					FirstQuoteFrom: { key: 'rfqBusinessPartnerFirstQuoteFrom', text: 'First  Quote From' },
					BusinessPartnerFk: { key: 'rfqBusinessPartnerBpSubsidiaryFax', text: 'Fax Number' },
					ContactFk: { key: 'bidder.contactRemarks', text: 'Contact Remarks' },
					SubsidiaryFk: { key: 'wizard.businessPartner.BranchEmail', text: 'Branch E-mail' },
					SupplierFk: { key: 'rfqBusinessPartnerSupplierCode', text: 'Supplier Code' },
					PrcCommunicationChannelFk: { key: 'rfqBusinessPartnerPrcCommunicationChannel', text: 'Communication Channel' },
					RfqRejectionReasonFk: { key: 'rfqBusinessPartnerRfqRejectionReason', text: 'Rejection Reason' },
					ExtendedDate: { key: 'entityExtendedDate', text: 'Extended Date' },
					ContactHasPortalUser: { key: 'rfqBusinessPartnerContactHasPortalUser', text: 'Contact has Portal-User' },
					partialReqFk: { key: 'partialReqAssigned', text: 'Partial Req. Assigned' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					SubsidiaryFk: { key: 'entitySubsidiary', text: 'Branch' },
					RfqBusinesspartnerStatusFk: { key: 'entityStatus', text: 'Status' },
					DateRequested: { key: 'entityDateRequested', text: 'Requested' },
					DateRejected: { key: 'entityDateRejected', text: 'Rejected' },
					Comments: { key: 'entityComment', text: 'Comments' },
					BusinessPartnerFk: { key: 'entityUserDefined', text: 'User-Defined 5' },
				}),
				...prefixAllTranslationKeys('businesspartner.main.', {
					BusinessPartnerFk: { key: 'entityStatus2', text: 'Status Sales' },
				}),
			},
			overloads: {
				Id: {
					readonly: true,
				},
				FirstQuoteFrom: {
					readonly: true,
				},
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					showClearButton: true,
					customServerSideFilterToken: ProcurementRfqBusinesspartnerBusinesspartnerFilterService,
					viewProviders: [
						{
							provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
							useValue: {
								showContacts: true,
								approvalBPRequired: true,
							},
						},
					],
					additionalFields: [
						createAdditionalField('BusinessPartnerStatus', 'StatusDescriptionTranslateInfo.Translated', { text: 'BusinessPartnerStatus', key: 'procurement.rfq.businessPartnerStatus' }),
						createAdditionalField('BusinessPartnerStatus', 'StatusDescriptionTranslateInfo.Translated', { text: 'BusinessPartnerStatus', key: 'procurement.rfq.businessPartnerStatus' }),
						createAdditionalField('BusinessPartnerStatus2', 'Status2DescriptionTranslateInfo.Translated', { text: 'BusinessPartnerStatus2', key: 'businesspartner.main.entityStatus2' }),
						createAdditionalField('bpEmail', 'Email', { text: 'Email', key: 'procurement.rfq.rfqBusinessPartnerBpEmail' }),
						createAdditionalField('Userdefined1', 'Userdefined1', { text: 'Userdefined1', key: 'cloud.common.entityUserDefined', params: { p_0: '1' } }),
						createAdditionalField('Userdefined2', 'Userdefined2', { text: 'Userdefined2', key: 'cloud.common.entityUserDefined', params: { p_0: '2' } }),
						createAdditionalField('Userdefined3', 'Userdefined3', { text: 'Userdefined3', key: 'cloud.common.entityUserDefined', params: { p_0: '3' } }),
						createAdditionalField('Userdefined4', 'Userdefined4', { text: 'Userdefined4', key: 'cloud.common.entityUserDefined', params: { p_0: '4' } }),
						createAdditionalField('Userdefined5', 'Userdefined5', { text: 'Userdefined5', key: 'cloud.common.entityUserDefined', params: { p_0: '5' } }),
					],
				}),
				ContactFk: bpRelatedLookupProvider.getContactLookupOverload({
					showClearButton: true,
					displayMember: 'FamilyName',
					customServerSideFilterToken: ProcurementRfqBusinesspartnerContactFilterService,
					additionalFields: [
						createAdditionalField('ContactFirstName', 'FirstName', { text: 'Contact First Name', key: 'procurement.rfq.rfqBusinessPartnerContactFirstName' }),
						createAdditionalField('ContactLastName', 'LastName', {text: 'Contact Last Name'}),
						createAdditionalField('ContactTitle', 'Title', { text: 'Contact Title', key: 'procurement.rfq.rfqBusinessPartnerContactTitle' }),
						createAdditionalField('ContactTel1', 'Telephone1', { text: 'Contact Telephone 1', key: 'procurement.rfq.rfqBusinessPartnerContactTel1' }),
						createAdditionalField('ContactTel2', 'Telephone2', { text: 'Contact Telephone 2', key: 'procurement.rfq.rfqBusinessPartnerContactTel2' }),
						createAdditionalField('ContactFax', 'Telefax', { text: 'Contact Fax Number', key: 'procurement.rfq.rfqBusinessPartnerContactFax' }),
						createAdditionalField('ContactMobile', 'Mobile', { text: 'Contact Mobile', key: 'procurement.rfq.rfqBusinessPartnerContactMobile' }),
						createAdditionalField('ContactInternet', 'Internet', { text: 'Contact Internet', key: 'procurement.rfq.rfqBusinessPartnerContactInternet' }),
						createAdditionalField('ContactEmail', 'Email', { text: 'Contact Email', key: 'procurement.rfq.rfqBusinessPartnerContactEmail' }),
						createAdditionalField('ContactSubsidiaryDescription', 'Description', { text: 'Contact Subsidiary Description', key: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryDescription' }),
						createAdditionalField('ContactSubsidiaryAddress', 'AddressLine', { text: 'Contact Address', key: 'procurement.rfq.rfqBusinessPartnerContactSubsidiaryAddress' }),
					],
				}),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					displayMember: 'SubsidiaryDescription',
					customServerSideFilterToken: ProcurementRfqBusinesspartnerSubsidiaryFilterService,
					additionalFields: [
						createAdditionalField('BpSubsidiaryDescription', 'Address', { text: 'Subsidiary Address', key: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryAddress' }),
						createAdditionalField('BpSubsidiaryEmail', 'Branch E-mail', { text: 'Branch E-mail', key: 'procurement.rfq.wizard.businessPartner.BranchEmail' }),
						createAdditionalField('BpSubsidiaryTel', 'TelephoneNumber1', { text: 'Telephone Number', key: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryTel' }),
						createAdditionalField('BpSubsidiaryFax', 'Telefax', { text: 'Fax Number', key: 'procurement.rfq.rfqBusinessPartnerBpSubsidiaryFax' }),
					],
				}),
				SupplierFk: bpRelatedLookupProvider.getSupplierLookupOverload({
					showClearButton: true,
					customServerSideFilterToken: ProcurementRfqBusinesspartnerSupplierFilterService,
					additionalFields: [createAdditionalField('SupplierDescription', 'Description', { text: 'Supplier Description', key: 'procurement.rfq.rfqBusinessPartnerSupplierDescription' })],
				}),
				PrcCommunicationChannelFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCommunicationChannelLookupService,
					}),
				},
				RfqBusinesspartnerStatusFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementSharedRfqBusinesspartnerStatusLookupService,
					}),
				},
				RfqRejectionReasonFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementSharedRfqRejectionReasonLookupService,
						showClearButton: true,
					}),
				},
				ContactHasPortalUser: {
					readonly: true,
				},
				/*partialReqFk: { // TODO-DRIZZLE:To be implemented
					type: FieldType.Lookup,
					lookupOptions: createLookup({dataServiceToken: Partial,})
				}*/
			},
			transientFields: [
				/*{
				id: 'partialReq',
				grid: {
					model: 'partialReqFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						// dataServiceToken: BusinessPartnerLookupService,
						// directive: 'procurement-rfq-complex-lookup' // TODO-DRIZZLE:To be migrated.
					}),
					readonly: true
				}
			},*/
				{
					id: 'ContactHasPortalUser',
					type: FieldType.Boolean,
					model: 'ContactHasPortalUser',
					readonly: true
				},
				{
					id: 'partialReqFk',
					type: FieldType.Boolean,
					model: 'partialReqFk',
					readonly: true
				}
			],
		};
	}
}

const createAdditionalField = function (id: string, displayMember: string, label: ITranslatable): IAdditionalLookupField {
	return {
		id: id,
		displayMember: displayMember,
		label: label,
		column: true,
		singleRow: true,
	};
};
