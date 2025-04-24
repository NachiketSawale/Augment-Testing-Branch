/*
 * Copyright(c) RIB Software GmbH
 */

import { IBillingSchemaDetailEntity, IRubricCategoryTreeItemEntity } from '@libs/basics/interfaces';
import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken, SplitGridContainerComponent } from '@libs/ui/business-base';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsBillingSchemaRubricCategoryDataService } from '../../services/basics-billing-schema-rubric-category-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedGeneralTypeLookupService, BasicsSharedLookupOverloadProvider, BasicsSharedPaymentTermLookupService } from '@libs/basics/shared';
import { BasicsBillingSchemaDetailsDataService } from '../../services/basics-billing-schema-details-data.service';

/**
 * Entity info for basics billing schema details
 */
export const BASICS_BILLING_SCHEMA_DETAILS_ENTITY_INFO = EntityInfo.create<IBillingSchemaDetailEntity>({
	grid: {
		title: {
			key: 'basics.billingschema.billingSchemaDetailListContainerTitle',
		},
		containerType: SplitGridContainerComponent,
		providers: (ctx) => [
			{
				provide: SplitGridConfigurationToken,
				useValue: <ISplitGridConfiguration<IBillingSchemaDetailEntity, IRubricCategoryTreeItemEntity>>{
					parent: {
						uuid: 'aef895205a3b40da98736c73594abc56',
						columns: [
							{
								id: 'description',
								model: 'DescriptionInfo',
								type: FieldType.Translation,
								label: {
									text: 'Description',
									key: 'cloud.common.entityDescription',
								},
								sortable: true,
								visible: true,
								readonly: true,
								formatterOptions: {
									field: 'DescriptionInfo.Translated',
								},
							},
						],
						dataServiceToken: BasicsBillingSchemaRubricCategoryDataService,
						treeConfiguration: {
							parent: function (entity: IRubricCategoryTreeItemEntity) {
								const service = ctx.injector.get(BasicsBillingSchemaRubricCategoryDataService);
								return service.parentOf(entity);
							},
							children: function (entity: IRubricCategoryTreeItemEntity) {
								const service = ctx.injector.get(BasicsBillingSchemaRubricCategoryDataService);
								return service.childrenOf(entity);
							},
						},
					},
				},
			},
		],
	},
	permissionUuid: '1971e3f3e88d434bb5276c0cc07f2e01',
	dataService: (ctx) => ctx.injector.get(BasicsBillingSchemaDetailsDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.BillingSchema', typeName: 'BillingSchemaDetailDto' },
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: [
						'AccountNo', 'Sorting', 'BillingSchemaDetailFk',
						'DescriptionInfo', 'Description2Info', 'BillingLineTypeFk',
						'FinalTotal', 'GeneralsTypeFk', 'IsBold',
						'IsEditable', 'IsItalic', 'IsHidden', 'IsHiddenIfZero', 'Group1',
						'Group2', 'HasControllingUnit', 'IsPrinted','IsResetFI','IsNetAdjusted',
						'IsTurnover', 'IsUnderline', 'OffsetAccountNo',
						'TaxCodeFk', 'Value', 'CredFactor', 'DebFactor', 'DetailAuthorAmountFk',
						'BillingSchemaDetailTaxFk', 'CredLineTypeFk', 'DebLineTypeFk', 'Formula',
						'CodeRetention', 'PaymentTermFk', 'CostLineTypeFk', 'SqlStatement'
				],
			},
			{
				gid: 'userDefText',
				title: {
					key: 'cloud.common.UserdefTexts',
					text: 'User-Defined Texts',
				},
				attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3'],
			}
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Formula: {
					key: 'formula',
					text: 'Formula',
				},
				Sorting: {	
					key: 'entitySorting',
					text: 'Sorting',
				},
				DescriptionInfo: {key: 'entityDescription'},
                UserDefined1: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 1',
                    params: {'p_0': '1'}
                },
                UserDefined2: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 2',
                    params: {'p_0': '2'}
                },
                UserDefined3: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 3',
                    params: {'p_0': '3'}
                },
			}),
			...prefixAllTranslationKeys('basics.billingschema.', {
				AccountNo: {
					key: 'entityAccountNo',
					text: 'Account No.',
				},
				Sorting: {
					key: 'entitySorting',
					text: 'Sorting',
				},
				BillingSchemaDetailFk: {
					key: 'entityBillingSchemaDetailFk',
					text: 'Reference',
				},
				BillingLineTypeFk: {
					key: 'entityBillingLineTypeFk',
					text: 'Type',
				},
				FinalTotal: {
					key: 'entityFinalTotal',
					text: 'Final',
				},
				GeneralsTypeFk: {
					key: 'entityGeneralsTypeFk',
					text: 'General Type',
				},
				IsHidden: {
					key: 'entityIsHidden',
					text: 'IsHidden',
				},
				IsHiddenIfZero: {
					key: 'entityIsHiddenIfZero',
					text: 'IsHiddenIfZero'
				},
				Group1: { 
					key: 'entityGroup1', 
					text: 'Group 1'
				},
				Group2: { 
					key: 'entityGroup2', 
					text: 'Group 2'
				},
				HasControllingUnit: {
					key: 'entityHasControllingUnit',
					text: 'Has Controlling Unit'
				},
				IsBold: { 
					key: 'entityIsBold', 
					text: 'Bold'
				},
				IsEditable: { 
					key: 'entityIsEditable', 
					text: 'Edit'
				},
				IsItalic: { 
					key: 'entityIsItalic', 
					text: 'Italic'
				},
				IsPrinted: { 
					key: 'entityIsPrinted', 
					text: 'Print'
				},
				IsTurnover: { 
					key: 'entityIsTurnover', 
					text: 'Turnover'
				},
				IsResetFI: { 
					key: 'entityIsResetFI', 
					text: 'Reset FI'
				},
				IsNetAdjusted: { 
					key: 'entityIsNetAdjusted', 
					text: 'Net Adjusted'
				},
				IsUnderline: { 
					key: 'entityIsUnderline', 
					text: 'Underline'
				},
				OffsetAccountNo: {
					key: 'entityOffsetAccountNo',
					text: 'Offset Account'
				},
				TaxCodeFk: { 
					key: 'entityTaxCodeFk',
					text: 'Tax Code'
				},
				Value: { 
					key: 'entityValue',
					text: 'Value'
				},
				CredFactor: { 
					key: 'credFactor',
					text: 'Cred Factor'
				},
				DebFactor: { 
					key: 'debFactor',
					text: 'Deb Factor'
				},
				DetailAuthorAmountFk: {
					key: 'billingschmdtlaafk',
					text: 'Author.Amount Ref'
				},
				BillingSchemaDetailTaxFk: {
					key: 'billingSchmDtlTaxFk',
					text: 'Tax Ref'
				},
				CredLineTypeFk: {
					key: 'creditorlinetype',
					text: 'Treatment Cred'
				},
				DebLineTypeFk: { 
					key: 'debitorlinetype', 
					text: 'Treatment Deb'
				},
				CostLineTypeFk: {
					key: 'costLineTypeFk',
					text: 'Cost Line Type'
				},
				CodeRetention: {
					key: 'codeRetention', 
					text: 'Code Retention'
				},
				PaymentTermFk: {
					key: 'paymentTerm', 
					text: 'Payment Term'
				},
				SqlStatement: {
					key: 'sqlStatement', 
					text: 'Sql Statement'
				},
				Description2Info: {
					key: 'entityDescription2', 
					text: 'Description 2'
				},
			}),
		},
		overloads: {
			TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
			BillingLineTypeFk:  BasicsSharedCustomizeLookupOverloadProvider.provideBillingLineTypeReadonlyLookupOverload(),
			GeneralsTypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedGeneralTypeLookupService,
					showClearButton: true
				})
			},
			CredLineTypeFk:  BasicsSharedCustomizeLookupOverloadProvider.provideCreditorLineTypeReadonlyLookupOverload(),
			DebLineTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDebitorLineTypeReadonlyLookupOverload(),
			CostLineTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCostLineTypeLookupOverload(true),
			PaymentTermFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			DetailAuthorAmountFk: {
				// TODO DetailAuthorAmountFk unable to use existing lookup
			},
			BillingSchemaDetailTaxFk: {
				// TODO BillingSchemaDetailTaxFk unable to use existing lookup
			},
			BillingSchemaDetailFk: {
				// TODO billingschemadetailfk
			}

		},
	},
});
