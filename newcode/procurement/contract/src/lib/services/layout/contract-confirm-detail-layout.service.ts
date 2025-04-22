import { inject, Injectable, StaticProvider } from '@angular/core';
import { IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { BUSINESSPARTNER_LOOKUP_INITIAL_VALUE_TOKEN, BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN } from '@libs/businesspartner/shared';
import { LazyInjectable, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE, IConHeaderEntity, IContractConfirmHeaderLayout } from '@libs/procurement/interfaces';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { FieldOverloadSpec, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE,
	useAngularInjection: true
})
/**
 * ContractConfirmDetailLayoutService :- service to provide layout details for contract confirm detail container.
 */
export class ContractConfirmDetailLayoutService implements IContractConfirmHeaderLayout {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	private async getBusinessPartnerLookupOverload(viewProviders?: StaticProvider[]): Promise<FieldOverloadSpec<IConHeaderEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
			serverFilterKey: 'procurement-contract-businesspartner-businesspartner-filter',
			filterIsLive: true,
			viewProviders: [
				...(viewProviders || []),
				{
					provide: BUSINESSPARTNER_LOOKUP_INITIAL_VALUE_TOKEN,
					useValue: {
						execute: (entity: IConHeaderEntity) => ({
							structureFk: entity?.PrcHeaderEntity?.StructureFk,
							addressFk: entity?.AddressFk,
							projectFk: entity?.ProjectFk,
							companyFk: entity?.CompanyFk,
							moduleName: 'procurement.contract',
						}),
					},
				},
			],
		});
	}

	private async getSupplierLookupOverload(
		bpGetter: (entity: IConHeaderEntity) => number | undefined | null,
		subsidiaryGetter: (entity: IConHeaderEntity) => number | undefined | null,
		useAdditionalFields?: boolean
	): Promise<FieldOverloadSpec<IConHeaderEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);

		return bpRelatedLookupProvider.getSupplierLookupOverload({
			serverFilterKey: 'businesspartner-main-supplier-common-filter',
			restrictToBusinessPartners: bpGetter,
			restrictToSubsidiaries: subsidiaryGetter,
			...(useAdditionalFields !== undefined ? { useAdditionalFields: useAdditionalFields } : {}),
		});
	}

	private getContractConfirmGroups() {
		return [
			{
				gid: 'baseGroup',
				title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
				attributes: ['Reference', 'ExternalCode', 'ConStatusFk', 'ClerkPrcFk', 'ProjectNo', 'ProvingPeriod', 'BasCurrencyFk', 'ConTypeFk', 'OverallDiscount'],
			},
			{
				gid: 'HeaderGroupDesiredSupplier',
				title: { key: 'procurement.contract.HeaderGroupDesiredSupplier', text: 'Contractor' },
				attributes: ['BusinessPartnerFk', 'BusinessPartner2Fk', 'BusinessPartnerAgentFk'],
			},
			{
				gid: 'HeaderGroupPenality',
				title: { key: 'procurement.contract.HeaderGroupPenality', text: 'Penality' },
				attributes: ['PenaltyPercentPerDay'],
			},
			{
				gid: 'TotalValue',
				title: { key: 'procurement.contract.total.totalValue', text: 'Total' },
				attributes: ['Net'],
			},
			{
				gid: 'CallOffValue',
				title: { key: 'procurement.contract.total.callOff', text: 'Call Off' },
				attributes: ['CallOffNet'],
			},
			{
				gid: 'GrandValue',
				title: { key: 'procurement.contract.total.grand', text: 'Grand Total' },
				attributes: ['GrandNet'],
			},
			{
				gid: 'ChangeOrderValue',
				title: { key: 'procurement.contract.total.changeOrder', text: 'Change Order' },
				attributes: ['ChangeOrderNet'],
			}
		];
	}

	private getContractaApprovalGroups() {
		return [
			{
				gid: 'baseGroup',
				title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
				attributes: ['ConStatusFk', 'Reference', 'ChangeOrderNet', 'MaterialCatalogFk', 'ProjectNo', 'PackageFk'],
			},
			{
				gid: 'HeaderGroupOther',
				title: {
					key: 'procurement.contract.HeaderGroupOther',
					text: 'Delivery Requirements',
				},
				attributes: ['AddressEntity'],
			},
			{
				gid: 'HeaderGroupDesiredSupplier',
				title: { key: 'procurement.contract.HeaderGroupDesiredSupplier', text: 'Contractor' },
				attributes: ['BusinessPartnerFk', 'SupplierFk'],
			},
			{
				gid: 'TotalValue',
				title: { key: 'procurement.contract.total.totalValue', text: 'Total' },
				attributes: ['Net'],
			},
			{
				gid: 'GrandValue',
				title: { key: 'procurement.contract.total.grand', text: 'Grand Total' },
				attributes: ['GrandNet'],
			}
		];
	}

	private getLabels() {
		return {
			...prefixAllTranslationKeys('procurement.contract.', {
				ChangeOrderNet: { key: 'total.changeOrderNet', text: 'Chg. Order Net' },
				GrandNet: { key: 'total.grandNet', text: 'Grand Net' },
				ClerkPrcFk: { key: 'ConHeaderProcurementOwner', text: 'Responsible' },
				MaterialCatalogFk: { key: 'conFrameworkMaterialCatalog', text: 'Framework Material Catalog' }
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				ConStatusFk: { text: 'Status', key: 'constatus' },
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				ProjectNo: { key: 'cloud.common.entityProject', text: 'Project No.' },
				BasCurrencyFk: { text: 'Currency', key: 'entityCurrency' },
				ConTypeFk: { key: 'entityType', text: 'Type' },
				Reference: { key: 'entityReference', text: 'Reference' },
				BusinessPartner2Fk: { key: 'entityBusinessPartner2', text: 'Business Partner2' },
				BusinessPartnerAgentFk: { key: 'entityBusinessPartnerAgent', text: 'Business Partner Agent' },
				PackageFk: { key: 'entityPackageCode', text: 'Package Code' }
			}),
			...prefixAllTranslationKeys('basics.procurementconfiguration.', {
				ProvingPeriod: { text: 'Proving Period', key: 'entityProvingPeriod' },
			}),
			...prefixAllTranslationKeys('procurement.common.', {
				OverallDiscount: { key: 'entityOverallDiscount', text: 'Overall Discount' },
				PackageFk: { key: 'entityPackageTextInfo', text: 'Package Text Info' }
			})
		};
	}

	public async generateLayout(isContractApproval:boolean): Promise<ILayoutConfiguration<IConHeaderEntity>> {

		return <ILayoutConfiguration<IConHeaderEntity>>{
			groups: isContractApproval? this.getContractaApprovalGroups():this.getContractConfirmGroups(),
			labels: this.getLabels(),
			overloads: {
				ConStatusFk: BasicsSharedLookupOverloadProvider.provideContractStatusLookupOverload(false, true),
				ClerkPrcFk: {
					readonly: true,
					...BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false, 'procurement.contract.ConHeaderProcurementOwnerName'),
				},
				BusinessPartnerFk: await this.getBusinessPartnerLookupOverload(),
				BusinessPartner2Fk: await this.getBusinessPartnerLookupOverload([
					{
						provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
						useValue: { showContacts: true },
					},
				]),
				BusinessPartnerAgentFk: await this.getBusinessPartnerLookupOverload(),
				PackageFk: ProcurementSharedLookupOverloadProvider.providePackageLookupOverload(true, 'cloud.common.entityPackageDescription', {
					key: '',
					execute(context: ILookupContext<IProcurementPackageLookupEntity, IConHeaderEntity>) {
						return {
							ProjectFk: context.entity?.ProjectFk,
							BasCompanyFk: context.entity?.CompanyFk,
						};
					},
				}),
				SupplierFk: this.getSupplierLookupOverload(
					(e) => e.BusinessPartnerFk,
					(e) => e.SubsidiaryFk,
				),
			},
			transientFields: [
				{
					id: 'Reference',
					model: 'Reference',
					type: FieldType.Composite,
					readonly: true,
					composite: [
						{ id: 'code', model: 'Code', type: FieldType.Code },
						{ id: 'description', model: 'Description', type: FieldType.Description },
					],
				},
			],
		};
	}
}
