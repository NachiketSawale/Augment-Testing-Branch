/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IPesHeaderEntity } from '../../model/entities';
import { IInitializationContext, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCompanyContextService, BasicsSharedLookupOverloadProvider, BasicsSharedProcurementConfigurationLookupService, IBillingSchemaEntity } from '@libs/basics/shared';
import { ProcurementSharedExchangeRateInputLookupService, ProcurementSharedLookupLayoutProvider, ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { ProcurementPesHeaderDataService } from '../procurement-pes-header-data.service';
import { IPesContractLookupFilter } from '../../model/entities/pes-contract-lookup-filter.interface';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN, IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
import { ControllingSharedControllingUnitLookupProviderService } from '@libs/controlling/shared';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';

/**
 * Pes header layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesHeaderLayoutService {
	private readonly injector = inject(Injector);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly controllingUnitLookupProvider = inject(ControllingSharedControllingUnitLookupProviderService);
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);
	private readonly procurementLookupLayoutProvider = inject(ProcurementSharedLookupLayoutProvider);

	public async generateConfig(context: IInitializationContext): Promise<ILayoutConfiguration<IPesHeaderEntity>> {
		const dataService = this.injector.get(ProcurementPesHeaderDataService);
		const configurationLookupService = this.injector.get(BasicsSharedProcurementConfigurationLookupService);
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		const projectLookupProvider = this.injector.get(ProjectSharedProjectLookupProviderService);
		const currencyLookupProvider = await this.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);


		const layoutConfig = <ILayoutConfiguration<IPesHeaderEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Id',
						'PesStatusFk',
						'ClerkPrcFk',
						'ClerkReqFk',
						'CurrencyFk',
						'Code',
						'Description',
						'DocumentDate',
						'DateDelivered',
						'DateDeliveredFrom',
						'PrcConfigurationFk',
						'PrcStructureFk',
						'PesValue',
						'PesVat',
						'IsNotAccrual',
						'ExchangeRate',
						'PesValueOc',
						'PesVatOc',
						'TotalGross',
						'TotalGrossOc',
						'BillingSchemaFk',
						'DateEffective',
						'BpdVatGroupFk',
						'PesHeaderFk',
						'SalesTaxMethodFk',
						'TotalStandardCost',
						'ExternalCode',
						'BillingSchemaFinal',
						'BillingSchemaFinalOC',
					],
				},
				{
					gid: 'supplier',
					title: {
						key: 'cloud.common.entitySupplier',
						text: 'Supplier',
					},
					attributes: ['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk'],
				},
				{
					gid: 'project',
					title: {
						key: 'cloud.common.entityProject',
						text: 'Project',
					},
					attributes: ['ProjectStatusFk', 'ProjectFk', 'PackageFk', 'ConHeaderFk', 'ControllingUnitFk', 'CallOffMainContractFk'],
				},
				{
					gid: 'userDefinedFields',
					title: {
						key: 'procurement.pes.entityUserDefinedFields',
						text: 'User-Defined Fields',
					},
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					ProjectStatusFk: {
						key: 'projectStatus',
						text: 'Project Status',
					},
					PesStatusFk: {
						key: 'transaction.pesStatus',
						text: 'PES Status',
					},
					TotalGross: {
						key: 'totalGross',
						text: 'Total (Gross)',
					},
					TotalGrossOc: {
						key: 'totalOcGross',
						text: 'Total (Gross OC)',
					},
					BpdVatGroupFk: {
						key: 'entityVatGroup',
						text: 'VAT Group',
					},
					PesHeaderFk: {
						key: 'transaction.pesHeader',
						text: 'Pes Header',
					},
					SalesTaxMethodFk: {
						key: 'entitySalesTaxMethodFk',
						text: 'Sales Tax Method',
					},
					ExternalCode: {
						key: 'externalCode',
						text: 'External Code',
					},
					CallOffMainContractFk: {
						key: 'callOffMainContract',
						text: 'Call Off Main Contract',
					},
					BillingSchemaFinal: {
						key: 'billingSchemaFinal',
						text: 'Billing Schema Final',
					},
					BillingSchemaFinalOC: {
						key: 'billingSchemaFinalOc',
						text: 'Billing Schema Final OC',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Id: {
						key: 'entityId',
						text: 'Id',
					},
					ProjectFk: {
						key: 'entityProjectNo',
						text: 'Project No.',
					},
					PackageFk: {
						key: 'entityPackage',
						text: 'Package',
					},
					CurrencyFk: {
						key: 'entityCurrency',
						text: 'Currency',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					Description: {
						key: 'entityDescription',
						text: 'Description',
					},
					ControllingUnitFk: {
						key: 'entityControllingUnit',
						text: 'Controlling Unit',
					},
					BusinessPartnerFk: {
						key: 'entityBusinessPartner',
						text: 'Business Partner',
					},
					SubsidiaryFk: {
						key: 'entitySubsidiary',
						text: 'Branch',
					},
					SupplierFk: {
						key: 'entitySupplierCode',
						text: 'Supplier No.',
					},
					UserDefined1: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '1' },
					},
					UserDefined2: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '2' },
					},
					UserDefined3: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '3' },
					},
					UserDefined4: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '4' },
					},
					UserDefined5: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '5' },
					},
					PrcStructureFk: {
						key: 'entityStructureCode',
						text: 'Structure Code',
					},
					PesValue: {
						key: 'entityTotal',
						text: 'Total',
					},
					ExchangeRate: {
						key: 'entityRate',
						text: 'Rate',
					},
					BillingSchemaFk: {
						key: 'entityBillingSchema',
						text: 'Billing Schema',
					},
				}),
				...prefixAllTranslationKeys('procurement.pes.', {
					ClerkPrcFk: {
						key: 'entityClerkPrcFk',
						text: 'Responsible',
					},
					ClerkReqFk: {
						key: 'entityClerkReqFk',
						text: 'Requisition Owner',
					},
					DocumentDate: {
						key: 'entityDocumentDate',
						text: 'Document Date',
					},
					DateDelivered: {
						key: 'entityDateDelivered',
						text: 'Date Delivered',
					},
					DateDeliveredFrom: {
						key: 'entityDateDeliveredFrom',
						text: 'Date Delivered From',
					},
					ConHeaderFk: {
						key: 'entityConHeaderFk',
						text: 'Contract',
					},
					PrcConfigurationFk: {
						key: 'entityPrcConfigurationFk',
						text: 'Configuration',
					},
					PesVat: {
						key: 'entityPesVat',
						text: 'VAT',
					},
					IsNotAccrual: {
						key: 'entityIsNotAccrual',
						text: 'Is not accrual',
					},
					PesValueOc: {
						key: 'entityPesValueOc',
						text: 'Total (OC)',
					},
					PesVatOc: {
						key: 'entityPesVatOc',
						text: 'VAT (OC)',
					},
					DateEffective: {
						key: 'entityDateEffective',
						text: 'Date Effective',
					},
					TotalStandardCost: {
						key: 'entityTotalStandardCost',
						text: 'Total Standard Cost',
					},
				}),
			},
			overloads: {
				ProjectStatusFk: BasicsSharedLookupOverloadProvider.provideProjectStatusReadonlyLookupOverload(),
				Id: {
					readonly: true,
				},
				PesStatusFk: BasicsSharedLookupOverloadProvider.providePesStatusReadonlyLookupOverload(),
				PesValue: {
					readonly: true,
				},
				PesVat: {
					readonly: true,
				},
				PesValueOc: {
					readonly: true,
				},
				PesVatOc: {
					readonly: true,
				},
				TotalGross: {
					readonly: true,
				},
				TotalGrossOc: {
					readonly: true,
				},
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				ClerkPrcFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'procurement.contract.ConHeaderProcurementOwnerName'),
				ClerkReqFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'procurement.contract.ConHeaderRequisitionOwnerName'),
				ProjectFk: projectLookupProvider.generateProjectLookup({
					lookupOptions: {
						showClearButton: true,
					},
				}),
				PrcConfigurationFk: BasicsSharedLookupOverloadProvider.provideProcurementConfigurationLookupOverload(),
				CurrencyFk: currencyLookupProvider.provideCurrencyLookupOverload({ showClearButton: false }),
				PesHeaderFk: ProcurementSharedLookupOverloadProvider.providePesHeaderReadonlyLookupOverload(),
				ControllingUnitFk: await this.controllingUnitLookupProvider.generateControllingUnitLookup(context, {
					checkIsAccountingElement: true,
					projectGetter: (e) => e.ProjectFk,
					controllingUnitGetter: (e) => e.ControllingUnitFk,
					lookupOptions: {
						showClearButton: true,
						serverSideFilter: {
							key: 'prc.con.controllingunit.by.prj.filterkey',
							execute: (context: ILookupContext<IControllingUnitLookupEntity, IPesHeaderEntity>) => {
								return {
									ByStructure: true,
									ExtraFilter: true,
									PrjProjectFk: context.entity?.ProjectFk,
									CompanyFk: this.companyContext.loginCompanyEntity.Id,
								};
							},
						},
					},
				}),
				ConHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'procurement.pes.entityConHeaderDescription', false, {
					key: 'prc-con-header-for-pes-filter',
					execute() {
						const currentItem = dataService.getSelectedEntity();
						if (!currentItem) {
							return {};
						}
						const filterObj: IPesContractLookupFilter = {
							StatusIsInvoiced: false,
							StatusIsCanceled: false,
							StatusIsVirtual: false,
							StatusIsOrdered: true,
							ControllingUnit: currentItem.ControllingUnitFk ?? undefined,
							PrcConfigurationId: currentItem.PrcConfigurationFk,
							IsFramework: false,
						};

						if (currentItem.BusinessPartnerFk && currentItem.BusinessPartnerFk !== -1) {
							filterObj.BusinessPartnerFk = currentItem.BusinessPartnerFk;
						}

						if (currentItem.PackageFk) {
							filterObj.PrcPackageFk = currentItem.PackageFk;
						}

						if (currentItem.PrcStructureFk) {
							filterObj.PrcStructureFk = currentItem.PrcStructureFk;
						}

						if (currentItem.ProjectFk) {
							filterObj.ProjectFk = currentItem.ProjectFk;
						}

						return filterObj;
					},
				}),
				BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true, {
					key: '',
					execute(context: ILookupContext<IBillingSchemaEntity, IPesHeaderEntity>) {
						if (!context.entity) {
							return '';
						}
						const config = configurationLookupService.cache.getItem({ id: context.entity.PrcConfigurationFk });
						return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
					},
				}),
				SalesTaxMethodFk: BasicsSharedLookupOverloadProvider.provideSalesTaxMethodLookupOverload(true),
				TotalStandardCost: {
					readonly: true,
				},
				PackageFk: ProcurementSharedLookupOverloadProvider.providePackageLookupOverload(true, 'cloud.common.entityPackageDescription', {
					key: 'prc-boq-package-for-pes-filter',
					execute(context: ILookupContext<IProcurementPackageLookupEntity, IPesHeaderEntity>) {
						if (!context.entity || !context.entity.ProjectFk) {
							return {};
						}
						return { ProjectFk: context.entity.ProjectFk };
					},
				}),
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					showClearButton: true,
					filterIsLive: true,
					serverFilterKey: 'procurement-contract-businesspartner-businesspartner-filter',
				}),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					serverFilterKey: 'businesspartner-main-supplier-common-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSuppliers: (entity) => entity.SupplierFk,
				}),
				SupplierFk: bpRelatedLookupProvider.getSupplierLookupOverload({
					showClearButton: true,
					serverFilterKey: 'businesspartner-main-supplier-common-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSubsidiaries: (entity) => entity.SubsidiaryFk,
				}),
				BillingSchemaFinal: {
					readonly: true,
				},
				BillingSchemaFinalOC: {
					readonly: true,
				},
				ExchangeRate: {
					type: FieldType.LookupInputSelect,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementSharedExchangeRateInputLookupService,
					}),
				},
				BpdVatGroupFk: BasicsSharedLookupOverloadProvider.provideVATGroupLookupOverload(true),
			},
		};

	this.procurementLookupLayoutProvider.providePackageLookupFields(layoutConfig, {
			gid: 'project',
			lookupKeyGetter: (e) => e.PackageFk,
			dataService: dataService,
		});
		return layoutConfig;
	}
}
