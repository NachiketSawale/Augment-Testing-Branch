/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';
import {
	BasicsCompanyLookupService,
	BasicsShareControllingUnitLookupService,
	BasicsSharedClerkLookupService,
	BasicsSharedConTypeLookupService,
	BasicsSharedCountryLookupService,
	BasicsSharedCurrencyLookupService,
	BasicsSharedLookupOverloadProvider,
	BasicsSharedPackageStatusLookupService,
	BasicsSharedPackageTypeLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedProcurementContractCopyModeLookupService,
	BasicsSharedProjectRegionLookupService,
	BasicsSharedProjectStatusLookupService,
	BasicsSharedSalesTaxMethodLookupService,
	BasicsSharedTaxCodeLookupService,
	BasicsSharedTelephoneDialogComponent,
	BasicsSharedUomLookupService,
	BasicsSharedVATGroupLookupService,
	createFormDialogLookupProvider,
	IControllingUnitEntity
} from '@libs/basics/shared';
import {
	PlatformConfigurationService,
	PlatformLazyInjectorService,
	prefixAllTranslationKeys
} from '@libs/platform/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { ProcurementPackageHeaderProjectFilterService } from '../filters/package-header-project-filter.service';
import { ProcurementPackageHeaderConfigurationFilterService } from '../filters/package-header-configuration-filter.service';
import { BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN, BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService, BusinesspartnerSharedSupplierLookupService } from '@libs/businesspartner/shared';
import { ISubsidiaryLookupEntity, ISupplierLookupEntity } from '@libs/businesspartner/interfaces';
import { ProcurementSharedExchangeRateInputLookupService } from '@libs/procurement/shared';
import { ProcurementPackageBaselinePhaseLookupService } from '../lookup-services/baseline-phase-lookup.service';
import { ProcurementCopyMode } from '@libs/procurement/common';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, SCHEDULE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { IBasicsAssetMasterEntity } from '@libs/basics/interfaces';

/**
 * Material group layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageHeaderLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	public async getLayout(): Promise<ILayoutConfiguration<IPrcPackageEntity>> {
		const activityLookupProvider = await this.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
		const scheduleLookupProvider = await this.lazyInjector.inject(SCHEDULE_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'HeaderGroupHeader',
					attributes: [
						'Id',
						'ProjectFk',
						'ProjectStatusFk',
						'CompanyFk',
						'ComCurrencyCode',
						'PackageStatusFk',
						'Code',
						'StructureFk',
						'ConfigurationFk',
						'PrcContractTypeFk',
						'CurrencyFk',
						'ExchangeRate',
						'Reference',
						'PlannedStart',
						'PlannedEnd',
						'ActualStart',
						'ActualEnd',
						'Quantity',
						'UomFk',
						'PackageTypeFk',
						'ClerkPrcFk',
						'ClerkReqFk',
						'TaxCodeFk',
						'BpdVatGroupFk',
						'Remark',
						'Remark2',
						'Remark3',
						'ScheduleFk',
						'ActivityFk',
						'AssetMasterFk',
						'TotalLeadTime',
						'BaselinePath',
						'BaselineUpdate',
						'BaselinePhase',
						'BaselineUpdateStatus',
						'DateEffective',
						'DateDelivery',
						'MdcControllingUnitFk',
						'OverallDiscount',
						'OverallDiscountOc',
						'OverallDiscountPercent',
						'TextInfo',
						'PrcCopyModeFk',
						'SalesTaxMethodFk',
						'DateAwardDeadline',
						'DateRequested'
					],
				},
				{
					gid: 'projectAddressGroup',
					attributes: ['CountryFk', /* 'addressentity', */ 'RegionFk', 'TelephoneNumberFk', 'TelephoneTelefaxFk', 'TelephoneMobileFk', 'Email'], // todo chi: do it later for complex type
				},
				{
					gid: 'Event',
					attributes: [],
				},
				{
					gid: 'Requisition',
					attributes: ['RequisitionCode', 'RequisitionStatus'],
				},
				{
					gid: 'RfQ',
					attributes: ['RfqCode', 'RfqStatus'],
				},
				{
					gid: 'Quote',
					attributes: [],
				},
				{
					gid: 'Contract',
					attributes: ['ContractCode', 'BusinessPartnerName', 'BusinessPartnerSubsidiaryName', 'SupplierNumber', 'ContractStatus'],
				},
				{
					gid: 'ExternalResponsible',
					attributes: ['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk'],
				},
				{
					gid: 'Performance',
					attributes: [],
				},
				{
					gid: 'Total',
					attributes: [],
				},
				{
					gid: 'HeaderGroupUserDefinedFields',
					attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5'],
				},
				{
					gid: 'SubmissionRequirement',
					attributes: ['DeadlineDate', 'DeadlineTime'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.customize.', {
					Id: { text: 'Id', key: 'entityid' },
				}),
				...prefixAllTranslationKeys('basics.common.', {
					StructureFk: { key: 'entityPrcStructureFk' },
					DateEffective: { key: 'dateEffective' },
					DateDelivery: { key: 'dateDelivered' },
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					AssetMasterFk: { key: 'mdcAssetMasterFk' },
					MdcControllingUnitFk: { key: 'mdcControllingUnitFk' },
				}),
				...prefixAllTranslationKeys('project.main.', {
					RegionFk: { key: 'entityRegion' },
				}),
				...prefixAllTranslationKeys('basics.procurementconfiguration.', {
					PrcContractTypeFk: { key: 'configuration.prccontracttypeFk' },
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					BpdVatGroupFk: { key: 'entityVatGroup' },
					TelephoneMobileFk: { key: 'contactMobile' },
					OverallDiscount: { key: 'entityOverallDiscount' },
					OverallDiscountOc: { key: 'entityOverallDiscountOc' },
					OverallDiscountPercent: { key: 'entityOverallDiscountPercent' },
					TextInfo: { key: 'entityTextInfo' },
					SalesTaxMethodFk: { key: 'entitySalesTaxMethodFk' },
					TotalLeadTime: { key: 'totalLeadTime' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CompanyFk: { key: 'entityCompany' },
					ProjectFk: { key: 'entityProjectNo' },
					PackageStatusFk: { key: 'entityState' },
					Description: { key: 'entityDescription' },
					CurrencyFk: { key: 'entityCurrency' },
					Code: { key: 'entityCode' },
					ExchangeRate: { key: 'entityRate' },
					Reference: { key: 'entityReference' },
					Quantity: { key: 'entityQuantity' },
					UomFk: { key: 'entityUoM' },
					ClerkPrcFk: { key: 'entityResponsible' },
					ClerkReqFk: { key: 'entityRequisitionOwner' },
					TaxCodeFk: { key: 'entityTaxCode' },
					Remark: { key: 'entityRemark' },
					Userdefined1: { key: 'entityUserDefined', params: { p_0: '1' } },
					Userdefined2: { key: 'entityUserDefined', params: { p_0: '2' } },
					Userdefined3: { key: 'entityUserDefined', params: { p_0: '3' } },
					Userdefined4: { key: 'entityUserDefined', params: { p_0: '4' } },
					Userdefined5: { key: 'entityUserDefined', params: { p_0: '5' } },
					BusinessPartnerFk: { key: 'entityBusinessPartner' },
					SubsidiaryFk: { key: 'entitySubsidiary' },
					SupplierFk: { key: 'entitySupplier' },
					UserDefinedDate1: { key: 'entityUserDefinedDate', params: { p_0: '1' } },
					UserDefinedDate2: { key: 'entityUserDefinedDate', params: { p_0: '2' } },
					UserDefinedDate3: { key: 'entityUserDefinedDate', params: { p_0: '3' } },
					UserDefinedDate4: { key: 'entityUserDefinedDate', params: { p_0: '4' } },
					UserDefinedDate5: { key: 'entityUserDefinedDate', params: { p_0: '5' } },
					CountryFk: { key: 'entityCountry' },
					TelephoneNumberFk: { key: 'TelephoneDialogPhoneNumber' },
					TelephoneTelefaxFk: { key: 'fax' },
					Email: { key: 'email' },
					DeadlineDate: { key: 'entityDeadline' },
					DeadlineTime: { key: 'entityTime' },
					AddressEntity: { key: 'entityDeliveryAddress' },
				}),
				...prefixAllTranslationKeys('procurement.package.', {
					ConfigurationFk: { key: 'entityConfiguration' },
					PlannedStart: { key: 'entityPlannedStart' },
					PlannedEnd: { key: 'entityPlannedEnd' },
					ActualStart: { key: 'entityActualStart' },
					ActualEnd: { key: 'entityActualEnd' },
					PackageTypeFk: { key: 'entityPackageType' },
					Remark2: { key: 'entityRemark2' },
					Remark3: { key: 'entityRemark3' },
					ActivityFk: { key: 'entityActivity' },
					ScheduleFk: { key: 'entitySchedule' },
					BaselinePath: { key: 'baselinePath' },
					BaselineUpdate: { key: 'baselineUpdate' },
					BaselinePhase: { key: 'baselinePhase' },
					PrcCopyModeFk: { key: 'entityPrcCopyModeFk' },
					BaselineUpdateStatus: { key: 'baselineUpdateStatus' },
					ComCurrencyCode: { key: 'ComCurrencyCode' },
					ComCurrencyDes: { key: 'entityComCurrencyDes' },
					RequisitionCode: { key: 'entityRequisition.code' },
					RequisitionDescription: { key: 'entityRequisition.description' },
					RequisitionStatus: { key: 'entityRequisition.status' },
					RfqCode: { key: 'entityRfQ.code' },
					RfqDescription: { key: 'entityRfQ.description' },
					RfqStatus: { key: 'entityRfQ.status' },
					ContractCode: { key: 'entityContract.code' },
					ContractDescription: { key: 'entityContract.description' },
					BusinessPartnerName: { key: 'entityContract.businessPartnerName' },
					BusinessPartnerSubsidiaryName: { key: 'entityContract.subsidiaryName' },
					SupplierNumber: { key: 'entityContract.supplierNumber' },
					ContractStatus: { key: 'entityContract.status' },
					ProjectStatusFk: { key: 'projectStatus' },
					DateRequested: {key: 'dateRequested' },
					DateAwardDeadline: {key: 'dateAwardDeadline' }
				}),
			},
			overloads: {
				Id: {
					readonly: true,
				},
				ComCurrencyCode: {
					readonly: true,
					// type: FieldType.Composite, // todo chi: not wording
					// composite: [
					// 	{
					// 		id: 'comCurrencyCode',
					// 		label: {
					// 			key: 'procurement.package.ComCurrencyCode',
					// 		},
					// 		type: FieldType.Code,
					// 		model: 'ComCurrencyCode',
					// 		sortOrder: 1,
					// 		readonly: true
					// 	},
					// 	{
					// 		id: 'comCurrencyDesc',
					// 		label: {
					// 			key: 'procurement.package.ComCurrencyDes'
					// 		},
					// 		type: FieldType.Description,
					// 		model: 'ComCurrencyDes',
					// 		sortOrder: 2,
					// 		readonly: true
					// 	},
					// ]
				},
				// Code: {
				// 	type: FieldType.Composite, // todo chi: not wording
				// 	composite: [
				// 		{
				// 			id: 'Code',
				// 			label: {
				// 				key: 'cloud.common.entityCode',
				// 			},
				// 			type: FieldType.Code,
				// 			model: 'Code',
				// 			sortOrder: 1,
				// 		},
				// 		{
				// 			id: 'Desc',
				// 			label: {
				// 				key: 'cloud.common.entityDescription'
				// 			},
				// 			type: FieldType.Description,
				// 			model: 'Description',
				// 			sortOrder: 2,
				// 		},
				// 	]
				// },
				ProjectFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProjectSharedLookupService,
						serverSideFilterToken: ProcurementPackageHeaderProjectFilterService,
					}),
				},
				ProjectStatusFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProjectStatusLookupService,
					}),
				},
				CompanyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName',
					}),
				},
				PackageStatusFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPackageStatusLookupService,
					}),
				},
				StructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				ConfigurationFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
						serverSideFilterToken: ProcurementPackageHeaderConfigurationFilterService,
					}),
				},
				PrcContractTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedConTypeLookupService,
						displayMember: 'DescriptionInfo.Translated',
					}),
				},
				CurrencyFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCurrencyLookupService,
					}),
				},
				UomFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
					}),
				},
				PackageTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPackageTypeLookupService,
						showClearButton: true,
						displayMember: 'DescriptionInfo.Translated',
					}),
				},
				ClerkPrcFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
					}),
				},
				ClerkReqFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
					}),
				},
				TaxCodeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTaxCodeLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
					}),
				},
				ActivityFk: activityLookupProvider.generateActivityLookup(),
				ScheduleFk: scheduleLookupProvider.generateScheduleLookup(),
				AssetMasterFk: BasicsSharedLookupOverloadProvider.provideAssetMasterLookupOverload(true, {
					key: 'basics-asset-master-filter',
					async execute(context: ILookupContext<IBasicsAssetMasterEntity, IPrcPackageEntity>) {
						if (!context.entity || !context.entity.ProjectFk) {
							// lookup project
							return null;
						}
						const projectLookupService = context.injector.get(ProjectSharedLookupService);
						const projectLookup = await projectLookupService.getItemByKeyAsync({ id: context.entity.ProjectFk });
						if (!projectLookup || !projectLookup.AssetMasterFk) {
							return null;
						}
						return { AssetMasterFk: projectLookup.AssetMasterFk };
					}
				}),
				RequisitionCode: {
					readonly: true,
					// type: FieldType.Composite,  // todo chi: not wording
					// composite: [
					// 	{
					// 		id: 'requisitionCode',
					// 		label: {
					// 			key: 'procurement.package.entityRequisition.code',
					// 		},
					// 		type: FieldType.Code,
					// 		model: 'RequisitionCode',
					// 		sortOrder: 1,
					// 		readonly: true
					// 	},
					// 	{
					// 		id: 'requisitionDesc',
					// 		label: {
					// 			key: 'procurement.package.entityRequisition.description'
					// 		},
					// 		type: FieldType.Description,
					// 		model: 'RequisitionDescription',
					// 		sortOrder: 2,
					// 		readonly: true
					// 	},
					// ]
				},
				RequisitionStatus: {
					// todo chi: special formatter
				},
				RfqCode: {
					readonly: true,
					// type: FieldType.Composite,  // todo chi: not wording
					// composite: [
					// 	{
					// 		id: 'rfqCode',
					// 		label: {
					// 			key: 'procurement.package.entityRfQ.code',
					// 		},
					// 		type: FieldType.Code,
					// 		model: 'RfqCode',
					// 		sortOrder: 1,
					// 		readonly: true
					// 	},
					// 	{
					// 		id: 'rfqDesc',
					// 		label: {
					// 			key: 'procurement.package.entityRfQ.description'
					// 		},
					// 		type: FieldType.Description,
					// 		model: 'RfqDescription',
					// 		sortOrder: 2,
					// 		readonly: true
					// 	},
					// ]
				},
				RfqStatus: {
					// todo chi: special formatter
				},
				ContractCode: {
					readonly: true,
					// type: FieldType.Composite,  // todo chi: not wording
					// composite: [
					// 	{
					// 		id: 'contractCode',
					// 		label: {
					// 			key: 'procurement.package.entityContract.code',
					// 		},
					// 		type: FieldType.Code,
					// 		model: 'ContractCode',
					// 		sortOrder: 1,
					// 		readonly: true
					// 	},
					// 	{
					// 		id: 'contractDesc',
					// 		label: {
					// 			key: 'procurement.package.entityContract.description'
					// 		},
					// 		type: FieldType.Description,
					// 		model: 'ContractDescription',
					// 		sortOrder: 2,
					// 		readonly: true
					// 	},
					// ]
				},
				BusinessPartnerName: {
					readonly: true,
				},
				BusinessPartnerSubsidiaryName: {
					readonly: true,
				},
				SupplierNumber: {
					readonly: true,
				},
				TotalLeadTime: {
					readonly: true,
				},
				BusinessPartnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						displayMember: 'BusinessPartnerName1',
						showClearButton: true,
						viewProviders: [
							{
								provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
								useValue: {
									showBranch: true,
								},
							},
						],
					}),
				},
				SubsidiaryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'businesspartner-main-subsidiary-common-filter',
							execute(context: ILookupContext<ISubsidiaryLookupEntity, IPrcPackageEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
								const currentItem = context.entity;
								return {
									BusinessPartnerFk: currentItem ? currentItem.BusinessPartnerFk : null,
									SupplierFk: currentItem ? currentItem.SupplierFk : null,
								};
							},
						},
					}),
				},
				SupplierFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSupplierLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						serverSideFilter: {
							key: 'prc-package-businesspartner-supplier-filter',
							execute(context: ILookupContext<ISupplierLookupEntity, IPrcPackageEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
								const currentItem = context.entity;
								return {
									BusinessPartnerFk: currentItem  ? currentItem.BusinessPartnerFk : null,
									SubsidiaryFk: currentItem ? currentItem.SubsidiaryFk : null,
								};
							},
						},
					}),
				},
				ContractStatus: {
					// todo chi: special formatter
				},
				AddressEntity: {
					// todo chi: special formatter
				},
				ExchangeRate: {
					type: FieldType.LookupInputSelect,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementSharedExchangeRateInputLookupService,
					}),
				},
				BaselinePath: {
					readonly: true,
				},
				BaselineUpdate: {
					readonly: true,
				},
				BaselinePhase: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementPackageBaselinePhaseLookupService,
					}),
				},
				BaselineUpdateStatus: {
					readonly: true,
				},
				BpdVatGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedVATGroupLookupService,
						showClearButton: true,
						displayMember: 'DescriptionInfo.Translated',
					}),
				},
				CountryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCountryLookupService,
						showClearButton: true,
					}),
				},
				RegionFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProjectRegionLookupService,
						showClearButton: true,
					}),
				},
				TelephoneNumberFk: {
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						showSearchButton: true,
						showPopupButton: true,
						objectKey: 'TelephoneNumber',
					}),
				},
				TelephoneTelefaxFk: {
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						showSearchButton: true,
						showPopupButton: true,
						objectKey: 'TelephoneNumberTelefax',
					}),
				},
				TelephoneMobileFk: {
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						showSearchButton: true,
						showPopupButton: true,
						objectKey: 'TelephoneMobil',
					}),
				},
				MdcControllingUnitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'prc.con.controllingunit.by.prj.filterkey',
							execute(context: ILookupContext<IControllingUnitEntity, IPrcPackageEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
								const configService = context.injector.get(PlatformConfigurationService);
								return {
									ByStructure: true,
									ExtraFilter: true,
									PrjProjectFk: !context.entity ? null : context.entity.ProjectFk,
									CompanyFk: configService.clientId,
								};
							},
						},
						selectableCallback: (dataItem) => {
							return dataItem.Isaccountingelement;
							// TODO - checkIsAccountingElement other logic
						},
						// considerPlanningElement: true // todo chi: how to use this?
					}),
				},
				PrcCopyModeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementContractCopyModeLookupService,
						showClearButton: true,
						displayMember: 'DescriptionInfo.Translated',
						clientSideFilter: {
							execute(item): boolean {
								return item.Id !== ProcurementCopyMode.CurrentPackageOnly;
							},
						},
					}),
				},
				SalesTaxMethodFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedSalesTaxMethodLookupService,
						showClearButton: true,
						displayMember: 'DescriptionInfo.Translated',
					}),
				},
			},
		};
	}
}
