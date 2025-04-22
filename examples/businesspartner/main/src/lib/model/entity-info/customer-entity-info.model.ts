import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { ILookupContext } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BusinesspartnerMainCustomerDataService } from '../../services/customer-data.service';
import {
	BusinesspartnerSharedCustomerStatusLookupService,
} from '@libs/businesspartner/shared';
import {
	BasicsSharedLookupOverloadProvider,
	BasicsSharedCustomizeLookupOverloadProvider,
	Rubric,
} from '@libs/basics/shared';
import { IBasicsCustomizeCustomerLedgerGroupEntity, IBasicsCustomizePostingGroupEntity } from '@libs/basics/interfaces';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, ICustomerEntity } from '@libs/businesspartner/interfaces';
import { CustomerGridBehavior } from '../../behaviors/businesspartner-main-customer-grid-behavior.service';
import { CustomerValidationService } from '../../services/validations/customer-validation.service';

export const CUSTOMER_ENTITY_INFO = EntityInfo.create<ICustomerEntity>({
	grid: {
		title: {
			text: 'Customer',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.customerGridContainerTitle',
		},
		// eslint-disable-next-line strict
		behavior: (ctx) => ctx.injector.get(CustomerGridBehavior),
	},
	form: {
		title: {
			text: 'Customer Detail',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.customerFormContainerTitle',
		},
		containerUuid: 'cb4e664d3a796afa8fb47a5cd74bbafb',
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(BusinesspartnerMainCustomerDataService),
	validationService: (ctx) => ctx.injector.get(CustomerValidationService),
	prepareEntityContainer: async (ctx) => {
		const lookupService = ctx.injector.get(BusinesspartnerSharedCustomerStatusLookupService);
		await Promise.all([lookupService.getList()]);
	},
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'CustomerDto' },
	permissionUuid: '53aa731b7da144cdbff201a7df205016',
	layoutConfiguration: async ctx => {
		const bpRelatedLookupProvider = await (ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN));
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: [
						'CustomerStatusFk',
						'BuyerReference',
						'Code',
						'CustomerLedgerGroupFk',
						'SupplierNo',
						'SubsidiaryFk',
						'CustomerBranchFk',
						'BusinessUnitFk',
						'PaymentTermFiFk',
						'PaymentTermPaFk',
						'BillingSchemaFk',
						'SubledgerContextFk',
						'BusinessPostingGroupFk',
						'VatGroupFk',
						'BasPaymentMethodFk',
						'BpdDunninggroupFk',
						'BlockingReasonFk',
						'Description',
						'Description2',
						'Einvoice',
						'CreditLimit',
						'CustomerLedgerGroupIcFk',
					],
				},
				{ gid: 'userDefined', attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'] },
			],
			overloads: {
				Code: {
					grid: {
						maxLength: 42,
						label: { key: 'businesspartner.main.entityDebtorCode' },
					},
					form: {
						maxLength: 42,
						label: { key: 'businesspartner.main.entityDebtorCode', text: 'Debtor Code' },
					},
				},
				CustomerStatusFk: bpRelatedLookupProvider.getCustomerStatusLookupOverload(),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload(),
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermPaDescription'),
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermFiDescription'),
				CustomerLedgerGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerLedgerGroupLookupOverload(false, {
					key: 'business-partner-main-customer-customerledgergroup-filter',
					execute(context: ILookupContext<IBasicsCustomizeCustomerLedgerGroupEntity, ICustomerEntity>) {
						return { BpdSubledgerContextFk: context.entity?.SubledgerContextFk };
					},
				},),
				BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(false),
				BusinessUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideBusinessUnitLookupOverload(false),
				CustomerBranchFk: bpRelatedLookupProvider.getBusinessPartnerCustomerBranchLookupOverload(),
				SubledgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideSubledgerContextReadonlyLookupOverload(),
				BlockingReasonFk: BasicsSharedCustomizeLookupOverloadProvider.provideBlockingReasonLookupOverload(true),
				BasPaymentMethodFk: BasicsSharedCustomizeLookupOverloadProvider.providePaymentMethodLookupOverload(true),
				BpdDunninggroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideDunningGroupLookupOverload(false),
				VatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(true),
				BusinessPostingGroupFk: BasicsSharedCustomizeLookupOverloadProvider.providePostingGroupLookupOverload(false, {
					key: 'business-partner-main-customer-businesspostinggroup-filter',
					execute(context: ILookupContext<IBasicsCustomizePostingGroupEntity, ICustomerEntity>) {
						return { BpdSubledgerContextFk: context.entity?.SubledgerContextFk };
					},
				},),
				CustomerLedgerGroupIcFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerLedgerGroupLookupOverload(true, {
					key: 'business-partner-main-customer-customerledgergroup-filter',
					execute(context: ILookupContext<IBasicsCustomizeCustomerLedgerGroupEntity, ICustomerEntity>) {
						return { BpdSubledgerContextFk: context.entity?.SubledgerContextFk };
					},
				},),
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true, {key: 'customer-rubric-category-lookup-filter',
					execute() {
						return {
							Rubric: Rubric.Customer,
						};
					},
				})
			},
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
					BuyerReference: { key: 'entityBuyerReference' },
					CustomerStatusFk: { key: 'entityStatus' },
					DebtorCode: { key: 'entityDebtorCode' },
					PaymentTermFiFk: { key: 'entityPaymentTermFI' },
					SubsidiaryFk: { key: 'entitySubsidiary' },
					PaymentTermPaFk: { key: 'entityPaymentTermPA' },
					CustomerLedgerGroupFk: { key: 'ledgerGroup' },
					BillingSchemaFk: { key: 'entityBillingSchema' },
					SupplierNo: { key: 'supplierNo' },
					BusinessUnitFk: { key: 'businessUnit' },
					SubledgerContextFk: { key: 'entitySubledgerContext' },
					VatGroupFk: { key: 'vatGroup' },
					BusinessPostingGroupFk: { key: 'businessPostingGroup' },
					BasPaymentMethodFk: { key: 'entityBasPaymentMethod' },
					BlockingReasonFk: { key: 'blockingReason' },
					Einvoice: { key: 'entityEinvoice' },
					CreditLimit: { key: 'creditLimit' },
					CustomerLedgerGroupIcFk: { key: 'ledgerGroupIcRecharging' },
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
					UserDefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
					UserDefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
					UserDefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
					UserDefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
					UserDefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
					Description: { key: 'entityDescription' },
					Description2: { key: 'entityDescription2' },
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					BpdDunninggroupFk: { key: 'dunninggroup' },
				}),
			},
		};
	}
});

