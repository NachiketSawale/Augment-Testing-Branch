/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILayoutConfiguration, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsCustomizeCertificateStatusEntity } from '@libs/basics/interfaces';
import { BusinesspartnerRelatedLookupProviderService } from '@libs/businesspartner/shared';
import { IContractLookupEntity, ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { SalesCommonContractLookupService } from '@libs/sales/shared';

export const BP_CERTIFICATE_LAYOUT: ILayoutConfiguration<ICertificateEntity> = {
	groups: [
		{
			gid: 'basicData',
			title: {text: 'Basic Data', key: 'cloud.common.entityProperties'},
			attributes: ['BusinessPartnerFk', 'CompanyFk', 'CertificateStatusFk', 'CertificateTypeFk', 'Code', 'CertificateDate', 'Issuer',
				'BusinessPartnerIssuerFk', 'ValidFrom', 'ValidTo', 'Reference', 'ReferenceDate', 'ProjectFk', 'Amount',
				'CurrencyFk', 'ExpirationDate', 'RequiredDate', 'DischargedDate', 'ValidatedDate', 'CommentText',
				'GuaranteeCost', 'GuaranteeCostPercent', 'ReclaimDate1', 'ReclaimDate2', 'ReclaimDate3', 'Islimited',
				'CostReimbursable', 'CostReimbursedDate', 'OrdHeaderFk', 'ConHeaderFk',]
		},
		{
			gid: 'userDefText',
			title: {key: 'cloud.common.UserdefTexts', text: 'User-Defined Texts',},
			attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
		}
	],
	overloads: {
		// Code: // todo chi: navigate

		BusinessPartnerFk: BusinesspartnerRelatedLookupProviderService.provideBusinessPartnerLookupOverload(false),
		CompanyFk: BasicsSharedLookupOverloadProvider.provideCertificateCompanyLookupOverload(true),
		CertificateStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideCertificateStatusReadonlyLookupOverload({
			select(item: IBasicsCustomizeCertificateStatusEntity): string {
				return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
			},
			getIconType() {
				return 'css';
			},
		}),
		CertificateTypeFk: BusinesspartnerRelatedLookupProviderService.provideBusinessPartnerSharedCertificateLookupOverload(false),
		BusinessPartnerIssuerFk: BusinesspartnerRelatedLookupProviderService.provideBusinessPartnerLookupOverload(true),
		ProjectFk: {
			type: FieldType.Lookup,
			visible: true,
			lookupOptions: createLookup({
				dataServiceToken: ProjectSharedLookupService,
				showDescription: true,
				descriptionMember: 'ProjectName',
				showClearButton: true,
			}),
			additionalFields: [
				{
					displayMember: 'ProjectName',
					label: {
						key: 'cloud.common.entityProjectName',
					},
					column: true,
					row: false,
					singleRow: true,
				},
			],
		},
		CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyTypeLookupOverload(true),
		// Use the default regex of FieldType.Percent for domain percent?
		// GuaranteeCostPercent: {
		// 	regex: '^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?\\d{0,8})([.,]\\d{0,2})?)$'
		// },
		// todo chi: navigate. It will be automatically supported when OrdHeaderFk is added to 'entity-foreign-keys.constant' and 'entity-key-module-mapping.model'.
		OrdHeaderFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: SalesCommonContractLookupService,
				showClearButton: true,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Translated',
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: {
						text: 'Sales Contract Description',
						key: 'businesspartner.certificate.orderHeaderDescription',
					},
					column: true,
					row: false,
					singleRow: true,
				},
			],
		},
		ConHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'businesspartner.certificate.contractDescription', false, {
			key: 'businesspartner-certificate-certificate-contract-filter',
			execute(context: ILookupContext<IContractLookupEntity, ICertificateEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
				return {BusinessPartnerFk: context.entity?.BusinessPartnerFk, ProjectFk: context.entity?.ProjectFk};
			},
		}),
	},
	transientFields: [
		{
			id: 'ConHeaderDescription',
			model: 'ConHeaderFk',
			...ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(false, 'Description', true),
			label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName + '.contractDescription'},
			readonly: true
		},
	],
	labels: {
		...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName + '.', {
			BusinessPartnerFk: {key: 'businessPartner'},
			ConHeaderFk: {key: 'contractCode'},
			CompanyFk: {key: 'company'},
			CertificateStatusFk: {key: 'status'},
			CertificateTypeFk: {key: 'type'},
			CertificateDate: {key: 'date'},
			Issuer: {key: 'issuer'},
			BusinessPartnerIssuerFk: {key: 'issuerBP'},
			ValidFrom: {key: 'validFrom'},
			ValidTo: {key: 'validTo'},
			ReferenceDate: {key: 'referenceDate'},
			ProjectFk: {key: 'project'},
			Amount: {key: 'amount'},
			CurrencyFk: {key: 'currency'},
			ExpirationDate: {key: 'expirationDate'},
			RequiredDate: {key: 'requiredDate'},
			DischargedDate: {key: 'dischargeDate'},
			ValidatedDate: {key: 'validatedDate'},
			GuaranteeCost: {key: 'guaranteecost'},
			GuaranteeCostPercent: {key: 'guaranteecostpercent'},
			ReclaimDate1: {key: 'reclaimdate1'},
			ReclaimDate2: {key: 'reclaimdate2'},
			ReclaimDate3: {key: 'reclaimdate3'},
			Islimited: {key: 'islimited'},
			CostReimbursable: {key: 'costreimbursable'},
			CostReimbursedDate: {key: 'costreimburseddate'},
			OrdHeaderFk: {key: 'orderHeader'},
		}),
		...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
			Reference: {key: 'entityReferenceName'},
			CommentText: {key: 'entityCommentText'},
			Userdefined1: {key: 'entityUserDefined', params: {'p_0': '1'}},
			Userdefined2: {key: 'entityUserDefined', params: {'p_0': '2'}},
			Userdefined3: {key: 'entityUserDefined', params: {'p_0': '3'}},
			Userdefined4: {key: 'entityUserDefined', params: {'p_0': '4'}},
			Userdefined5: {key: 'entityUserDefined', params: {'p_0': '5'}},
		}),
	}
};