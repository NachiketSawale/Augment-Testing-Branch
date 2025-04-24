/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialPriceVersionToCustomerDataService } from './basics-material-price-version-to-customer-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILookupContext } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedCustomerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IMdcMatPricever2custEntity } from '../model/entities/mdc-mat-pricever-2-cust-entity.interface';
import { ICustomerLookupEntity, ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';
import { BasicsMaterialPriceVersionToCustomerValidationService } from './basics-material-price-version-to-customer-validation.service';

export const BASICS_MATERIAL_PRICE_VERSION_TO_CUSTOMER_ENTITY_INFO = EntityInfo.create<IMdcMatPricever2custEntity>({
	grid: {
		title: { text: 'Price Version to Customer', key: 'basics.materialcatalog.priceVersionToCustomerTitle' },
	},
	form: {
		containerUuid: 'b1bfa3cff92b48a9ae61b5a83d42b9ff',
		title: { text: 'Price Version to Customer Detail', key: 'basics.materialcatalog.priceVersionToCustomerDetailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialPriceVersionToCustomerDataService),
	validationService: (context) => context.injector.get(BasicsMaterialPriceVersionToCustomerValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MdcMatPricever2custDto' },
	permissionUuid: '77179cb5ca2c4b16afee01b2bc0aadb7',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: ['BpdBusinesspartnerFk', 'BpdSubsidiaryFk', 'BpdCustomerFk', 'BasPaymentTermFk', 'MdcBillingSchemaFk', 'TermsConditions'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				BpdBusinesspartnerFk: {
					key: 'entityBusinessPartner',
					text: 'Business Partner',
				},
				BpdSubsidiaryFk: {
					key: 'entitySubsidiary',
					text: 'Branch',
				},
				BpdCustomerFk: {
					key: 'entityCustomer',
					text: 'Customer',
				},
				BasPaymentTermFk: {
					key: 'entityPaymentTermPA',
					text: 'Payment Term (PA)',
				},
				MdcBillingSchemaFk: {
					key: 'entityBillingSchema',
					text: 'Billing Schema',
				},
			}),
			...prefixAllTranslationKeys('basics.materialcatalog.', {
				TermsConditions: {
					key: 'termsAndConditions',
					text: 'Terms And Conditions',
				},
			}),
		},
		overloads: {
			BpdBusinesspartnerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
				}),
			},
			BpdSubsidiaryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					showClearButton: true,
					serverSideFilter: {
						key: 'mdc-material-catalog-customer-subsidiary-filter',
						execute(context: ILookupContext<ISubsidiaryLookupEntity, IMdcMatPricever2custEntity>) {
							return {
								BusinessPartnerFk: context.entity ? context.entity.BpdBusinesspartnerFk : null,
								CustomerFk: context.entity ? context.entity.BpdCustomerFk : null,
							};
						},
					},
				}),
			},
			BpdCustomerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedCustomerLookupService,
					displayMember: 'BusinessPartnerName1',
					showClearButton: true,
					serverSideFilter: {
						key: 'project-main-project-customer-filter',
						execute(context: ILookupContext<ICustomerLookupEntity, IMdcMatPricever2custEntity>) {
							return {
								BusinessPartnerFk: context.entity ? context.entity.BpdBusinesspartnerFk : null,
								SubsidiaryFk: context.entity ? context.entity.BpdSubsidiaryFk : null,
							};
						},
					},
				}),
			},
			BasPaymentTermFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
			MdcBillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true),
		},
	},
});
