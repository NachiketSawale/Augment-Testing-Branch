/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonCertificateEntityInfo, ProcurementCommonCertificateLayoutService } from '@libs/procurement/common';
import { ProcurementInvoiceCertificateDataService } from '../../services/procurement-invoice-certificate-data.service';
import { mergeLayout } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementInvoiceCertificateBehavior } from '../../behaviors/procurement-invoice-certificate-behavior.service';

export const PROCUREMENT_INVOICE_CERTIFICATE_ENTITY_INFO=ProcurementCommonCertificateEntityInfo.create({
	permissionUuid: '11ec024d7dd3412bb53beda7741b6636',
	formUuid: '90d5538e5a104059930d394296e96d8b',
	dataServiceToken: ProcurementInvoiceCertificateDataService,
	moduleSubModule:'Procurement.Invoice',
	typeName:'InvCertificateDto',
	layout:async context  => {
		return mergeLayout(await context.injector.get(ProcurementCommonCertificateLayoutService).generateLayout(), {
			groups: [
				{
					gid: 'basicData',
					attributes: ['BPName1','IsRequired','IsRequiredSubSub','IsMandatory','IsMandatorySubSub','Code','Description']
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.invoice.', {
					IsRequired: {key: 'entityAdvanceType', text: 'Advance Type'},
					Code: {key: 'header.code', text: 'Entry No.'},
					Description: {key: 'entityReference', text: 'Reference'}
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					IsRequired: {key: 'certificateIsRequired', text: 'Required'},
					IsMandatory: {key: 'certificateIsMandatory', text: 'Mandatory'},
					IsRequiredSubSub: {key: 'certificateIsRequiredSubSub', text: 'Sub-Sub required'},
					IsMandatorySubSub: {key: 'certificateIsMandatorySubSub', text: 'Sub-Sub mandatory'}
				}),
				...prefixAllTranslationKeys('businesspartner.main.', {
					BPName1: {key: 'name1', text: 'Business Partner Name'}
				})
			},
			overloads: {
				Code: { readonly:true},
				Description: { readonly:true},
				BPName1: { readonly:true},
			}
		});
	},
	behavior:ProcurementInvoiceCertificateBehavior
});