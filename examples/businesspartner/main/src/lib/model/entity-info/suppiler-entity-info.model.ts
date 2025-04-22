import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { SupplierDataService } from '../../services/suppiler-data.service';
import { prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import {ILookupContext } from '@libs/ui/common';
import {
	BasicsSharedStatusIconService, Rubric,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';
import {
	IBasicsCustomizeBpSupplierStatusEntity,
	IBasicsCustomizePostingGroupEntity,
	IBasicsCustomizeSupplierLedgerGroupEntity,
} from '@libs/basics/interfaces';
import { SupplierGridBehavior } from '../../behaviors/businesspartner-main-suppiler-grid-behavior.service';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IBusinessPartnerBankEntity, ISubsidiaryLookupEntity, ISupplierEntity } from '@libs/businesspartner/interfaces';
import { SupplierInitService } from '../../services/init-service/businesspartner-data-provider.service';
import { SupplierValidationService } from '../../services/validations/supplier-validation.service';

export const SUPPLIER_ENTITY_INFO = EntityInfo.create<ISupplierEntity>({
	grid: {
		title: { text: 'supplier', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.supplierContainerTitle' },
		behavior: (ctx) => ctx.injector.get(SupplierGridBehavior),
	},
	form: {
		title: { text: 'Supplier Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.supplierContainerDetail' },
		containerUuid: '23f48d0283624c7bb3d5b57339d5f038',
	},
	validationService: (ctx) => ctx.injector.get(SupplierValidationService),
	dataService: (ctx) => ctx.injector.get(SupplierDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'SupplierDto' },
	permissionUuid: '7f5057a88b974acd9fb5a00cee60a33d',
	prepareEntityContainer: async (ctx) => {
		const supplierInitService = ctx.injector.get(SupplierInitService);
		await supplierInitService.init();
	},
	layoutConfiguration: async ctx => {
		const bpRelatedLookupProvider = await ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: [
						'SupplierStatusFk',
						'SupplierLedgerGroupFk',
						'Code',
						'Description',
						'Description2',
						'CustomerNo',
						'PaymentTermPaFk',
						'PaymentTermFiFk',
						'SubledgerContextFk',
						'VatGroupFk',
						'SubsidiaryFk',
						'BusinessPostingGroupFk',
						'BankFk',
						'BasPaymentMethodFk',
						'BusinessPostGrpWhtFk',
						'BlockingReasonFk',
						'SupplierLedgerGroupIcFk',
						'RubricCategoryFk',
					],
				},
				{
					gid: 'userDefined',
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
					SupplierStatusFk: { key: 'supplierStatus' },
					SupplierLedgerGroupFk: { key: 'ledgerGroup' },
					CreditorCode: { key: 'entityCreditorCode' },
					CustomerNo: { key: 'customerNo' },
					SubledgerContextFk: { key: 'entitySubledgerContext' },
					VatGroupFk: { key: 'vatGroup' },
					BusinessPostingGroupFk: { key: 'businessPostingGroup' },
					BlockingReasonFk: { key: 'blockingReason' },
					SupplierLedgerGroupIcFk: { key: 'ledgerGroupIcRecharging' },
					Code: { key: 'entityCreditorCode' },
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
					Description: { key: 'entityDescription' },
					PaymentTermPaFk: { key: 'entityPaymentTermPA' },
					PaymentTermFiFk: { key: 'entityPaymentTermFI' },
					SubsidiaryFk: { key: 'entitySubsidiary' },
					UserDefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
					UserDefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
					UserDefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
					UserDefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
					UserDefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
					BankFk: { key: 'entityBankName' },
					BasPaymentMethodFk: { key: 'entityBasPaymentMethod' },
					BusinessPostGrpWhtFk: { key: 'entityBusinessPostGrpWht' },
					RubricCategoryFk: { key: 'entityBasRubricCategoryFk' },
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.billingSchemaModuleName + '.', {
					Description2: { key: 'entityDescription2' },
				}),
			},
			overloads: {
				Code: { maxLength: 42 },
				SupplierStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpSupplierStatusReadonlyLookupOverload(ServiceLocator.injector.get(BasicsSharedStatusIconService<IBasicsCustomizeBpSupplierStatusEntity, ISupplierEntity>)),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					customServerSideFilter: {
						key: 'businesspartner-main-subsidiary-common-filter',
						execute(context: ILookupContext<ISubsidiaryLookupEntity, ISupplierEntity>) {
							return {
								BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
							};
						},
					},
				}),
				SupplierLedgerGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideSupplierLedgerGroupLookupOverload(false, {
					key: 'business-partner-main-supplier-supplierledgergroup-filter',
					execute(context: ILookupContext<IBasicsCustomizeSupplierLedgerGroupEntity, ISupplierEntity>) {
						return {
							BpdSubledgerContextFk: context.entity?.SubledgerContextFk,
						};
					},
				},),
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermPaDescription'),
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermFiDescription'),
				SubledgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideSubledgerContextLookupOverload(false),
				VatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(true),
				BlockingReasonFk: BasicsSharedCustomizeLookupOverloadProvider.provideBlockingReasonLookupOverload(true),
				BusinessPostingGroupFk: BasicsSharedCustomizeLookupOverloadProvider.providePostingGroupLookupOverload(false, {
					key: 'business-partner-main-supplier-businesspostinggroup-filter',
					execute(context: ILookupContext<IBasicsCustomizePostingGroupEntity, ISupplierEntity>) {
						return {
							BpdSubledgerContextFk: context.entity?.SubledgerContextFk,
						};
					},
				},),
				BankFk: bpRelatedLookupProvider.getBankLookupOverload({
					showClearButton: true, displayMember: 'BankIbanWithName', disableInput: true, customServerSideFilter: {
						key: 'business-partner-main-bank-filter',
						execute(context: ILookupContext<IBusinessPartnerBankEntity, ISupplierEntity>) {
							return {
								BusinessPartnerFk: context.entity?.BusinessPartnerFk,
							};
						},
					},
				}),
				BasPaymentMethodFk: BasicsSharedCustomizeLookupOverloadProvider.providePaymentMethodLookupOverload(true),
				BusinessPostGrpWhtFk: BasicsSharedCustomizeLookupOverloadProvider.providePostingGroupWithholdingTaxLookupOverload(true),
				SupplierLedgerGroupIcFk: BasicsSharedCustomizeLookupOverloadProvider.provideSupplierLedgerGroupLookupOverload(true, {
					key: 'business-partner-main-supplier-supplierledgergroup-filter',
					execute(context: ILookupContext<IBasicsCustomizeSupplierLedgerGroupEntity, ISupplierEntity>) {
						return {
							BpdSubledgerContextFk: context.entity?.SubledgerContextFk,
						};
					},
				},),
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true, {
					key: 'supplier-rubric-category-lookup-filter',
					execute() {
						return {
							Rubric: Rubric.Supplier,
						};
					},
				},)
			}
		};
	}
});
