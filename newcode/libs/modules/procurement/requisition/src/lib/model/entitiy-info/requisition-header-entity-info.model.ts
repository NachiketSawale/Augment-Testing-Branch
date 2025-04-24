import {EntityInfo} from '@libs/ui/business-base';
import {
	IReqHeaderLookUpEntity,
	ProcurementModule,
	ProcurementPackageLookupService, ProcurementSharedExchangeRateInputLookupService,
	ProcurementShareReqLookupService
} from '@libs/procurement/shared';
import {
	PlatformConfigurationService,
	PlatformDateService, PlatformTranslateService,
	prefixAllTranslationKeys,
	ServiceLocator
} from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	ILookupContext,
	LookupAlertTheme,
	ServerSideFilterValueType, UiCommonMessageBoxService
} from '@libs/ui/common';
import {ProjectSharedLookupService} from '@libs/project/shared';
import {
	BasicsCompanyLookupService,
	BasicsShareControllingUnitLookupService,
	BasicsSharedClerkLookupService,
	BasicsSharedBasCurrencyLookupService,
	BasicsSharedMaterialCatalogLookupService,
	BasicsSharedMaterialCatalogTypeLookupService,
	BasicsSharedPaymentTermLookupService,
	BasicsSharedPrcIncotermLookupService,
	BasicsSharedTaxCodeLookupService,
	BasicsSharedAwardMethodLookupService,
	BasicsSharedConTypeLookupService,
	BasicsSharedProjectStatusLookupService,
	BasicsSharedReqStatusLookupService,
	BasicsSharedReqTypeLookupService,
	BasicsSharedSalesTaxMethodLookupService,
	BasicsSharedVATGroupLookupService,
	IControllingUnitEntity,
	BasicsSharedNumberGenerationService,
	BasicsSharedCompanyContextService
} from '@libs/basics/shared';
import {
	BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
	BusinessPartnerLookupService,
	BusinesspartnerSharedSubsidiaryLookupService,
	BusinesspartnerSharedSupplierLookupService,
} from '@libs/businesspartner/shared';
import {
	ProcurementCommonCurrencyConversionFilterService, ProcurementCommonSystemOptionBudgetEditingService,
} from '@libs/procurement/common';
import {IReqHeaderEntity} from '../entities/reqheader-entity.interface';
import {ProcurementRequisitionHeaderDataService} from '../../services/requisition-header-data.service';
import {
	ProcurementRequisitionHeaderProjectFilterService
} from '../../services/filters/req-header-project-filter.service';
import {IMaterialCatalogLookupEntity, IProcurementPackageLookupEntity} from '@libs/basics/interfaces';
import {forEach} from 'lodash';
import {
	ProcurementRequisitionHeaderValidationService
} from '../../services/validations/requisition-header-validation.service';
import { ISubsidiaryLookupEntity, ISupplierLookupEntity } from '@libs/businesspartner/interfaces';

export const PROCUREMENT_REQUISITION_HEADER_ENTITY_INFO = EntityInfo.create<IReqHeaderEntity>({
	grid: {
		title: 'procurement.requisition.headerGrid.reqheaderGridTitle',
	},
	form: {
		title: 'procurement.requisition.headerForm.reqheaderFormTitle',
		containerUuid: 'ceeee3e1a4ca4696b5aebbe32f7cbdf6'
	},
	permissionUuid: '509f8b1f81ea475fbebf168935641489',
	dataService: ctx => ctx.injector.get(ProcurementRequisitionHeaderDataService),
	validationService: ctx => ctx.injector.get(ProcurementRequisitionHeaderValidationService),
	dtoSchemeId: {moduleSubModule: ProcurementModule.Requisition, typeName: 'ReqHeaderDto'},
	prepareEntityContainer: async ctx => {
		const prcCompanyContextSrv = ctx.injector.get(BasicsSharedCompanyContextService);
		const numberService = ctx.injector.get(BasicsSharedNumberGenerationService);
		const budgetEditingService = ctx.injector.get(ProcurementCommonSystemOptionBudgetEditingService);
		const materialCatTypeLookupService = ctx.injector.get(BasicsSharedMaterialCatalogTypeLookupService);
		const requisitionStatusService = ctx.injector.get(BasicsSharedReqStatusLookupService);
		await Promise.all([
			prcCompanyContextSrv.prepareLoginCompany(),
			numberService.getNumberGenerateConfig('procurement/requisition/numbergeneration/list'),
			budgetEditingService.getBudgetEditingInProcurementAsync(),
			materialCatTypeLookupService.getList(),
			requisitionStatusService.getList()
		]);
	},
	layoutConfiguration: {
		groups: [
			{
				'gid': 'HeaderGroupHeader',
				'attributes': ['Id', 'ProjectFk', 'ProjectStatusFk', 'CompanyFk', 'Code', 'BasCurrencyFk', 'ExchangeRate',
					'ClerkPrcFk', 'ClerkReqFk', 'TaxCodeFk', 'BpdVatGroupFk', 'MaterialCatalogFk', 'PackageFk',
					'ProjectChangeFk', 'ReqStatusFk', 'ReqHeaderFk', 'DateReceived', 'DateCanceled', 'DateRequired',
					'ReqTypeFk', 'ControllingUnitFk', 'BasPaymentTermFiFk', 'BasPaymentTermPaFk', 'BasPaymentTermAdFk',
					'PrcAwardmethodFk', 'RfqCode', 'RfqDescription', 'DatePriceFixing', 'BoqWicCatFk', 'BoqWicCatBoqFk',
					'TotalLeadTime', 'DateEffective', 'DateDelivery', 'OverallDiscount', 'OverallDiscountOc',
					'OverallDiscountPercent', 'SalesTaxMethodFk', 'PlannedStart', 'PlannedEnd', 'DateAwardDeadline', 'DateRequested'
				]
			},
			{
				'gid': 'HeaderGroupDesiredSupplier',
				'attributes': ['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk']
			},
			{
				'gid': 'HeaderGroupDeliveryRequirements',
				'attributes': ['IncotermFk', /*'AddressEntity',*/ 'Remark', 'PrcContracttypeFk'] // todo chi: common complex field is not available
			},
			{
				'gid': 'HeaderGroupUserDefinedFields',
				'attributes': ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
			},
			{
				'gid': 'SubmissionRequirement',
				'attributes': ['DeadlineDate', 'DeadlineTime']
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.customize.', {
				Id: {text: 'Id', key: 'entityid'},
			}),
			...prefixAllTranslationKeys('basics.common.', {
				DateEffective: {key: 'dateEffective'},
				DateDelivery: {key: 'dateDelivered'},
			}),
			...prefixAllTranslationKeys('procurement.common.', {
				ProjectStatusFk: {key: 'projectStatus'},
				BpdVatGroupFk: {key: 'entityVatGroup'},
				OverallDiscount: {key: 'entityOverallDiscount'},
				OverallDiscountOc: {key: 'entityOverallDiscountOc'},
				OverallDiscountPercent: {key: 'entityOverallDiscountPercent'},
				SalesTaxMethodFk: {key: 'entitySalesTaxMethodFk'},
				TotalLeadTime: {key: 'totalLeadTime'},
				BoqWicCatFk: {'key': 'entityFwBoqWicCatFk'},
				BoqWicCatBoqFk: {'key': 'entityFwBoqWicCatBoqFk'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				PackageFk: {key: 'entityPackage'},
				CompanyFk: {key: 'entityCompany'},
				ProjectFk: {key: 'entityProjectNo'},
				ReqStatusFk: {key: 'entityState'},
				BasCurrencyFk: {key: 'entityCurrency'},
				ExchangeRate: {key: 'entityRate'},
				DateReceived: {key: 'entityReceived'},
				ClerkPrcFk: {key: 'entityResponsible'},
				ClerkReqFk: {key: 'entityRequisitionOwner'},
				TaxCodeFk: {key: 'entityTaxCode'},
				Remark: {key: 'entityRemark'},
				Userdefined1: {key: 'entityUserDefined', params: {'p_0': '1'}},
				Userdefined2: {key: 'entityUserDefined', params: {'p_0': '2'}},
				Userdefined3: {key: 'entityUserDefined', params: {'p_0': '3'}},
				Userdefined4: {key: 'entityUserDefined', params: {'p_0': '4'}},
				Userdefined5: {key: 'entityUserDefined', params: {'p_0': '5'}},
				BusinessPartnerFk: {key: 'entityBusinessPartner'},
				SubsidiaryFk: {key: 'entitySubsidiary'},
				SupplierFk: {key: 'entitySupplier'},
				DeadlineDate: {key: 'entityDeadline'},
				DeadlineTime: {key: 'entityTime'},
				DateCanceled: {key: 'entityCancelled'},
				DateRequired: {key: 'entityRequired'},
				ReqTypeFk: {key: 'entityType'},
				ControllingUnitFk: {key: 'entityControllingUnitCode'},
				BasPaymentTermFiFk: {key: 'entityPaymentTermFI'},
				BasPaymentTermPaFk: {key: 'entityPaymentTermPA'},
				BasPaymentTermAdFk: {key: 'entityPaymentTermAD'},
				PrcAwardmethodFk: {key: 'entityAwardMethod'},
				AddressEntity: {key: 'entityDeliveryAddress'}
			}),
			...prefixAllTranslationKeys('procurement.requisition.', {
				ProjectChangeFk: {key: 'entityChangeOrder'},
				Code: {key: 'code'},
				ReqHeaderFk: {'key': 'headerGrid.reqheaderBasisRequisition'},
				MaterialCatalogFk: {'key': 'headerGrid.reqFrameworkMaterialCatalog'},
				IncotermFk: {key: 'headerForm.reqheaderIncoterms'},
				PrcContracttypeFk: {key: 'headerGrid.reqheaderContractType'},
				Description: {key: 'requisitionName'},
				RfqCode: {key: 'headerGrid.rfqCode'},
				RfqDescription: {'key': 'headerGrid.rfqDescription'},
				DatePriceFixing: {'key': 'entityDatePriceFixing'},
			}),
			...prefixAllTranslationKeys('procurement.package.', {
				PlannedStart: {key: 'entityPlannedStart'},
				PlannedEnd: {key: 'entityPlannedEnd'},
				DateRequested: {key: 'dateRequested' },
				DateAwardDeadline: {key: 'dateAwardDeadline' }
			}),
		},
		overloads: {
			Id: {
				readonly: true
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
					serverSideFilterToken: ProcurementRequisitionHeaderProjectFilterService
				}),
			},
			ProjectStatusFk: {
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProjectStatusLookupService
				})
			},
			CompanyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showDescription: true,
					descriptionMember: 'CompanyName'
				})
			},
			ReqStatusFk: {
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedReqStatusLookupService
				})
			},
			PackageFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementPackageLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
					serverSideFilter: {
						key: '',
						execute(context: ILookupContext<IProcurementPackageLookupEntity, IReqHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							const companyContext = context.injector.get(BasicsSharedCompanyContextService);
							const loginCompany = companyContext.loginCompanyEntity;
							if (!loginCompany) {
								return {};
							}
							// var loginProject = moduleContext.loginProject;// todo chi: common logic is not available
							const targetProject = context.entity?.ProjectFk; //||  loginProject; // todo chi: do it later
							if (!targetProject) {
								return {
									BasCompanyFk: loginCompany
								};
							}
							return {
								ProjectFk: targetProject,
								BasCompanyFk: loginCompany
							};
						}
					}
				})
			},
			// ProjectChangeFk: { // todo chi: do it later
			// 	type: FieldType.Lookup,
			// 	lookupOptions: createLookup({
			// 		dataServiceToken: // todo chi: common lookup is not available
			// 	})
			// },
			ReqHeaderFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareReqLookupService,  // todo chi: common lookup is not available
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
					dialogOptions: {
						alerts: [{
							theme: LookupAlertTheme.Info,
							message: 'procurement.common.reqHeaderUpdateInfo'
						}]
					},
					serverSideFilter: {
						key: 'prc-req-header-filter',
						execute(context: ILookupContext<IReqHeaderLookUpEntity, IReqHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							const configService = context.injector.get(PlatformConfigurationService);
							return {
								CompanyFk: configService.clientId,// todo stone: is login company?
								ProjectFk: context.entity?.ProjectFk,
								ExcludedHeaderId: context.entity?.Id
							};
						}
					}
				})
			},
			MaterialCatalogFk: {
				// todo chi: navigation
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedMaterialCatalogLookupService,  // todo chi: common lookup is not available
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
					dialogOptions: {
						headerText: 'procurement.contract.frameworkMaterialCatalogSearchDialog'
					},
					buildSearchString: (searchText) => {
						const matCatLookupService = ServiceLocator.injector.get(BasicsSharedMaterialCatalogLookupService);
						const matCatTypeLookupService = ServiceLocator.injector.get(BasicsSharedMaterialCatalogTypeLookupService);
						const messageBoxService = ServiceLocator.injector.get(UiCommonMessageBoxService);
						const translationService = ServiceLocator.injector.get(PlatformTranslateService);
						const isFrameworkCatalogType = matCatTypeLookupService.getFrameworkCatalogTypes();

						if (!isFrameworkCatalogType) {
							messageBoxService.showMsgBox(translationService.instant('procurement.contract.noIsFrameworkMaterialCatalogType').text,
								translationService.instant('cloud.common.errorMessage').text, 'ico-error');
						}
						if (matCatLookupService.config.buildSearchString) {
							return matCatLookupService.config.buildSearchString(searchText);
						}
						return '';
					},
					serverSideFilter: {
						key: 'prc-req-header-filter',
						execute(context: ILookupContext<IMaterialCatalogLookupEntity, IReqHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							const reqService = context.injector.get(ProcurementRequisitionHeaderDataService);
							const dateService = context.injector.get(PlatformDateService);
							const currentItem = reqService.getSelectedEntity();
							if (!currentItem) {
								return '';
							}
							const date = currentItem.DateRequired || Date.now();
							const dateOrderedISO = 'DateTime(' + dateService.formatUTC(date, 'yyyy,MM,dd') + ')';
							let filterPrefix = '';
							if (reqService.isFrameworkCatalogTypes?.length) {
								let typeFilterStr = '(';
								forEach(reqService.isFrameworkCatalogTypes, function (catalogType, idx) {
									typeFilterStr += 'MaterialCatalogTypeFk = ' + catalogType.Id;
									if (reqService.isFrameworkCatalogTypes.length - 1 === idx) {
										typeFilterStr += ')';
									} else {
										typeFilterStr += ' or ';
									}
								});
								filterPrefix = typeFilterStr + ' And ';
							} else {
								filterPrefix = 'MaterialCatalogTypeFk = -1 And ';
							}
							let filter = filterPrefix + '(ValidFrom = null Or ValidFrom<=%date%) And (ValidTo = null Or ValidTo>=%date%)';
							filter = filter.replace(/%date%/g, dateOrderedISO);
							return filter;
						}
					}
				})
			},
			DateCanceled: {
				readonly: true
			},
			ReqTypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedReqTypeLookupService,
					displayMember: 'DescriptionInfo.Translated'
				})
			},
			BasPaymentTermFiFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
				})
			},
			BasPaymentTermPaFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
				})
			},
			BasPaymentTermAdFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
				})
			},
			PrcAwardmethodFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedAwardMethodLookupService,
					showClearButton: true,
					displayMember: 'DescriptionInfo.Translated'
				})
			},
			RfqDescription: {
				readonly: true
			},
			BoqWicCatBoqFk: {
				// todo chi: lookup service is not available
			},
			IncotermFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPrcIncotermLookupService,
					showClearButton: true,
				})
			},
			BoqWicCatFk: {
				// todo chi: need BoqWicGroupLookupService export
				// type: FieldType.Lookup,
				// lookupOptions: createLookup({
				// 	dataServiceToken: BoqWicGroupLookupService,
				// 	displayMember: 'Code'
				// })
			},
			// StructureFk: { // todo chi: move it to transient field
			// 	type: FieldType.Lookup,
			// 	lookupOptions: createLookup({
			// 		dataServiceToken: BasicsSharedProcurementStructureLookupService,
			// 		showClearButton: true,
			// 		showDescription: true,
			// 		descriptionMember: 'DescriptionInfo.Translated'
			// 	})
			// },
			// ConfigurationFk: { // todo chi: move it to transient field
			// 	type: FieldType.Lookup,
			// 	lookupOptions: createLookup({
			// 		dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
			// 		serverSideFilterToken: ProcurementPackageHeaderConfigurationFilterService
			// 	})
			// },
			PrcContracttypeFk: { // todo chi: check
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedConTypeLookupService,
					displayMember: 'DescriptionInfo.Translated'
				})
			},
			BasCurrencyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedBasCurrencyLookupService,
					serverSideFilterToken: ProcurementCommonCurrencyConversionFilterService
				})
			},
			ClerkPrcFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			ClerkReqFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			TaxCodeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedTaxCodeLookupService,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated'
				})
			},
			RfqCode: {
				readonly: true,
				// todo chi: formatter is not available in grid

			},
			TotalLeadTime: {
				readonly: true
			},
			BusinessPartnerFk: {
				// todo chi: navigation
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
					showClearButton: true,
					viewProviders: [{
						provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
						useValue: {
							showBranch: true
						}
					}]
				})
			},
			SubsidiaryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					showClearButton: true,
					serverSideFilter: {
						key: 'businesspartner-main-subsidiary-common-filter',
						execute(context: ILookupContext<ISubsidiaryLookupEntity, IReqHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							const currentItem = context.entity;
							return {
								BusinessPartnerFk: currentItem ? currentItem.BusinessPartnerFk : null,
								SupplierFk: currentItem ? currentItem.SupplierFk : null
							};
						}
					}
				})
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
						execute(context: ILookupContext<ISupplierLookupEntity, IReqHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							const currentItem = context.entity;
							return {
								BusinessPartnerFk: currentItem ? currentItem.BusinessPartnerFk : null,
								SubsidiaryFk: currentItem ? currentItem.SubsidiaryFk : null
							};
						}
					}
				})
			},
			AddressEntity: { // todo chi: special formatter
			},
			ExchangeRate: {
				type: FieldType.LookupInputSelect,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementSharedExchangeRateInputLookupService
				})
			},
			BpdVatGroupFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedVATGroupLookupService,
					showClearButton: true
				})
			},
			ControllingUnitFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsShareControllingUnitLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
					serverSideFilter: {
						key: 'prc.con.controllingunit.by.prj.filterkey',
						execute(context: ILookupContext<IControllingUnitEntity, IReqHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							return {
								ByStructure: true,
								ExtraFilter: true,
								PrjProjectFk: !context.entity ? null : context.entity.ProjectFk,
								CompanyFk: null
							};
						}
					},
					selectableCallback: (dataItem) => {
						return dataItem.Isaccountingelement;
						// TODO - checkIsAccountingElement other logic
					},
				})
			},
			SalesTaxMethodFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedSalesTaxMethodLookupService,
					showClearButton: true,
					displayMember: 'DescriptionInfo.Translated',
				})
			}
		}
	}
});