/*
 * $Id: project-main-translation-service.js 627643 2021-03-15 11:16:25Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules used directly.
	const projectMainModule = 'project.main';
	const basicsCommonModule = 'basics.common';
	const basicsCompanyModule = 'basics.company';
	const basicsCurrencyModule = 'basics.currency';
	const basicsCustomizeModule = 'basics.customize';
	const basicsCostGroupsModule = 'basics.costgroups';
	const basicsUserFormModule = 'basics.userform';
	const cloudCommonModule = 'cloud.common';
	const projectCostCodesModule = 'project.costcodes';
	const businessPartnerMain = 'businesspartner.main';
	const businessPartnerCertificate = 'businesspartner.certificate';
	const basicsClerk = 'basics.clerk';
	const estimateMainModule = 'estimate.main';
	const objectMainModule = 'object.main';
	const productionplanningCommonModule = 'productionplanning.common';
	const productionplanningMountingModule = 'productionplanning.mounting';
	const modelEvaluationModule = 'model.evaluation';
	const basicsCharacteristic = 'basics.characteristic';
	const logisticJobModule = 'logistic.job';
	const basicsPriceConditionModule = 'basics.pricecondition';
	const basicsProcurementConfigurationModule = 'basics.procurementconfiguration';
	const objectProjectModule = 'object.project';
	const projectCalendarModule = 'project.calendar';
	const modelProjectModule = 'model.project';
	const timekeepingCommonModule = 'timekeeping.common';
	const controllingRevRecognitionModule='controlling.revrecognition';
	const locationModule = 'project.location';
	const projectGroupModule = 'project.group';
	const resourceEquipmentModule = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name projectMainTranslationService
	 * @description provides translation for project main module
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(projectMainModule).factory('projectMainTranslationService', ['platformTranslationUtilitiesService', 'salesBidProjectTranslationService',
		'salesBillingProjectTranslationService', 'salesContractProjectTranslationService', 'salesWipProjectTranslationService', 'schedulingScheduleTranslationService',
		'projectStockTranslationService', 'businesspartnerCertificateProjectTranslationService',

		function projectMainTranslationServiceFactory (platformTranslationUtilitiesService, salesBidProjectTranslationService, salesBillingProjectTranslationService, salesContractProjectTranslationService,
			salesWipProjectTranslationService, schedulingScheduleTranslationService, projectStockTranslationService, bpCertificateProjectTranslationService) {
			var service = {};

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [projectMainModule, basicsCompanyModule, basicsClerk, basicsCustomizeModule, basicsCurrencyModule, basicsUserFormModule, cloudCommonModule,
					projectCostCodesModule, businessPartnerMain, businessPartnerCertificate, estimateMainModule, objectMainModule, productionplanningCommonModule,
					productionplanningMountingModule, 'constructionsystem.project', 'controlling.structure', 'estimate.parameter', 'estimate.main',
					'estimate.rule', 'boq.main', 'model.project', 'project.location', 'project.structures','productionplanning.engineering',
					'documents.project','project.material', 'model.wdeviewer', modelEvaluationModule, basicsCharacteristic, logisticJobModule, projectCalendarModule,
					'scheduling.calendar', basicsCommonModule, basicsPriceConditionModule, basicsProcurementConfigurationModule, objectProjectModule,'scheduling.main',
					'change.main', timekeepingCommonModule,controllingRevRecognitionModule, locationModule,'procurement.stock']
			};

			data.words = {
				listTitle: {location: projectMainModule, identifier: 'listContainerTitle', initial: 'Projects'},
				detailTitle: {
					location: projectMainModule,
					identifier: 'detailContainerTitle',
					initial: 'Details Project'
				},
				remarkTitle: {location: projectMainModule, identifier: 'remarkContainerTitle', initial: 'Remark'},
				deletePrj: {location: projectMainModule, identifier: 'taskBarDeletePrj', initial: 'Delete Project'},
				newPrj: {location: projectMainModule, identifier: 'taskBarNewPrj', initial: 'New Project'},
				StatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Basic Data'},
				RubricCategoryFk: {location: projectMainModule, identifier: 'entityRubric', initial: 'Rubric Category'},
				GroupFk: {location: cloudCommonModule, identifier: 'entityGroup', initial: 'Group'},
				TypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				ProjectNo: {location: projectMainModule, identifier: 'projectNo', initial: 'Number'},
				ProjectLongNo: {location: projectMainModule, identifier: 'projectLongNo', initial: 'Long Number'},
				ProjectIndex: {location: cloudCommonModule, identifier: 'entityIndex', initial: 'Index'},
				ProjectName: {location: cloudCommonModule, identifier: 'entityName', initial: 'Name'},
				ProjectName2: {location: projectMainModule, identifier: 'name2', initial: 'Name 2'},
				Matchcode: {location: projectMainModule, identifier: 'entityMatchCode', initial: 'Matchcode'},
				ProjectDescription: {
					location: cloudCommonModule,
					identifier: 'entityDescription',
					initial: 'Description'
				},
				ClerkAddress: { location: projectMainModule, identifier: 'entityClerkAddress', initial: 'Clerk Address' },
				ClerkEmail: { location: projectMainModule, identifier: 'entityClerkEmail', initial: 'Clerk Email' },
				ClerkMobileNumber: { location: projectMainModule, identifier: 'entityClerkMobileNumber', initial: 'Clerk MobileNumber' },
				ClerkTelephoneNumber: { location: projectMainModule, identifier: 'entityClerkTelephoneNumber', initial: 'Clerk TelephoneNumber' },
				CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
				CompanyResponsibleFk: {
					location: projectMainModule,
					identifier: 'entityProfitCenter',
					initial: 'Profit Center'
				},
				StartDate: {location: cloudCommonModule, identifier: 'entityStartDate', initial: 'Start'},
				EndDate: {location: cloudCommonModule, identifier: 'entityEndDate', initial: 'End'},
				BusinessUnitFk: {
					location: projectMainModule,
					identifier: 'entityBusinessUnit',
					initial: 'Business Unit'
				},
				customerGroup: {location: projectMainModule, identifier: 'customerGroup', initial: 'Customer'},
				BusinessPartnerFk: {
					location: projectMainModule,
					identifier: 'entityBusinessPartner',
					initial: 'Business Partner'
				},
				SubsidiaryFk: {location: projectMainModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'},
				CustomerFk: {location: projectMainModule, identifier: 'entityCustomer', initial: 'Customer'},
				CustomerGroupFk: {
					location: projectMainModule,
					identifier: 'entityCustomerGroup',
					initial: 'Customer Group'
				},
				ContactFk: {location: projectMainModule, identifier: 'entityContact', initial: 'Contact'},
				RealEstateFk: {location: projectMainModule, identifier: 'entityRealEstate', initial: 'Real Estate'},
				projectAddressGroup: {
					location: projectMainModule,
					identifier: 'projectAddressGroup',
					initial: 'Project Address'
				},
				AddressFk: {location: basicsCompanyModule, identifier: 'entityAddress', initial: 'Address'},
				CountryFk: {location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country'},
				RegionFk: {location: projectMainModule, identifier: 'entityRegion', initial: 'Region'},
				contractGroup: {location: projectMainModule, identifier: 'contractGroup', initial: 'Contract'},
				ContractTypeFk: {
					location: projectMainModule,
					identifier: 'entityContractTypeFk',
					initial: 'Contract Type'
				},
				ContractNo: {location: projectMainModule, identifier: 'entityContractNo', initial: 'Contract No'},
				PaymentTermPaFk: {
					location: projectMainModule,
					identifier: 'entityPaymentTermPa',
					initial: 'Payment Term Pa'
				},
				PaymentTermFiFk: {
					location: projectMainModule,
					identifier: 'entityPaymentTermFi',
					initial: 'Payment Term Fi'
				},
				BillingSchemaFk: {
					location: projectMainModule,
					identifier: 'entityBillingSchema',
					initial: 'Billing Schema'
				},
				WICFk: {location: projectMainModule, identifier: 'entityWIC', initial: 'WIC'},
				CallOffNo: {location: projectMainModule, identifier: 'entityCallOffNo', initial: 'Call-Off No'},
				CallOffDate: {location: projectMainModule, identifier: 'entityCallOffDate', initial: 'Call-Off Date'},
				CallOffRemark: {
					location: projectMainModule,
					identifier: 'entityCallOffRemark',
					initial: 'Call-Off Remark'
				},
				submissionGroup: {location: projectMainModule, identifier: 'submissionGroup', initial: 'Submission'},
				PublicationDate: {
					location: projectMainModule,
					identifier: 'entityPublicationDate',
					initial: 'Published'
				},
				DateReceipt: {
					location: projectMainModule,
					identifier: 'entityTenderReceipt',
					initial: 'Tender Receipt'
				},
				ValidityDate: {
					location: projectMainModule,
					identifier: 'entityValidityDate',
					initial: 'Validity Date'
				},
				ValidityPeriod: {
					location: projectMainModule,
					identifier: 'entityValidityPeriod',
					initial: 'Validity Period'
				},
				ClosingDatetime: {
					location: projectMainModule,
					identifier: 'entityClosingDate',
					initial: 'Closing Date'
				},
				ClosingLocation: {
					location: projectMainModule,
					identifier: 'entityClosingLocation',
					initial: 'Closing Location'
				},
				PlannedAwardDate: {
					location: projectMainModule,
					identifier: 'entityPlannedAward',
					initial: 'Planned Award'
				},
				TenderDate: {location: projectMainModule, identifier: 'entityTenderDate', initial: 'Tender Date'},
				TenderRemark: {location: projectMainModule, identifier: 'entityTenderRemark', initial: 'Tender Remark'},
				warrantyGroup: {location: projectMainModule, identifier: 'warrantyGroup', initial: 'Warranty'},
				HandoverDate: {location: projectMainModule, identifier: 'entityHandoverDate', initial: 'Handover'},
				WarrentyStart: {location: projectMainModule, identifier: 'entityWarStartDate', initial: 'War. Start'},
				WarrentyEnd: {location: projectMainModule, identifier: 'entityWarEndDate', initial: 'War. End'},
				WarrentyRemark: {
					location: projectMainModule,
					identifier: 'entityWarrentyRemark',
					initial: 'War. Remark'
				},
				settingGroup: {location: cloudCommonModule, identifier: 'toolbarSetting', initial: 'Settings'},
				CalendarFk: {location: cloudCommonModule, identifier: 'entityCalCalendarFk', initial: 'Calendar (FI)'},
				listCostGroup1Title: {
					location: projectMainModule,
					identifier: 'listCostGroup1Title',
					initial: 'Cost Group1 List'
				},
				detailCostGroup1Title: {
					location: projectMainModule,
					identifier: 'detailCostGroup1Title',
					initial: 'Details Cost Group1'
				},
				listCostGroup2Title: {
					location: projectMainModule,
					identifier: 'listCostGroup2Title',
					initial: 'Cost Group2 List'
				},
				detailCostGroup2Title: {
					location: projectMainModule,
					identifier: 'detailCostGroup2Title',
					initial: 'Details Cost Group2'
				},
				listCostGroup3Title: {
					location: projectMainModule,
					identifier: 'listCostGroup3Title',
					initial: 'Cost Group3 List'
				},
				detailCostGroup3Title: {
					location: projectMainModule,
					identifier: 'detailCostGroup3Title',
					initial: 'Details Cost Group3'
				},
				listCostGroup4Title: {
					location: projectMainModule,
					identifier: 'listCostGroup4Title',
					initial: 'Cost Group4 List'
				},
				detailCostGroup4Title: {
					location: projectMainModule,
					identifier: 'detailCostGroup4Title',
					initial: 'Details Cost Group4'
				},
				listCostGroup5Title: {
					location: projectMainModule,
					identifier: 'listCostGroup5Title',
					initial: 'Cost Group5 List'
				},
				detailCostGroup5Title: {
					location: projectMainModule,
					identifier: 'detailCostGroup5Title',
					initial: 'Details Cost Group5'
				},
				listChangeTitle: {location: projectMainModule, identifier: 'listChangeTitle', initial: 'Changes'},
				detailChangeTitle: {
					location: projectMainModule,
					identifier: 'detailChangeTitle',
					initial: 'Details Change'
				},
				ChangeStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Basic Data'},
				LastDate: {location: projectMainModule, identifier: 'entityLastDate', initial: 'Last Date'},
				Reference: {location: projectMainModule, identifier: 'entityReference', initial: 'Reference'},
				ChangeTypeFk: {location: projectMainModule, identifier: 'entityChangeType', initial: 'Type'},
				Probability: {location: projectMainModule, identifier: 'entityProbability', initial: 'Incident Rate'},
				ExpectedCost: {location: projectMainModule, identifier: 'entityExpectedCost', initial: 'Expected Cost'},
				ExpectedRevenue: {
					location: projectMainModule,
					identifier: 'entityExpectedRevenue',
					initial: 'ExpectedRevenue'
				},
				projectWizardNoImpl: {
					location: projectMainModule,
					identifier: 'projectWizardNoImpl',
					initial: 'Sorry, not implemented yet'
				},
				createProjectTitle: {
					location: projectMainModule,
					identifier: 'createProjectTitle',
					initial: 'Create Project'
				},
				createAlternativeTitle: {
					location: projectMainModule,
					identifier: 'createAlternativeTitle',
					initial: 'Create Project-Alternative'
				},
				setActiveAlternativeTitle: {
					location: projectMainModule,
					identifier: 'setActiveAlternativeTitle',
					initial: 'Set Active Project-Alternative'
				},
				disableProjectTitle: {
					location: projectMainModule,
					identifier: 'disableProjectTitle',
					initial: 'Disable Project'
				},
				enableProjectTitle: {
					location: projectMainModule,
					identifier: 'enableProjectTitle',
					initial: 'Enable Project'
				},
				disableProjectDone: {
					location: projectMainModule,
					identifier: 'disableProjectDone',
					param: {prj: ''},
					initial: 'Project {{p_0}} is disabled successfully'
				},
				projectAlreadyDisabled: {
					location: projectMainModule,
					identifier: 'projectAlreadyDisabled',
					param: {prj: ''},
					initial: 'Project {{p_0}} is already disabled'
				},
				enableProjectDone: {
					location: projectMainModule,
					identifier: 'enableProjectDone',
					param: {prj: ''},
					initial: 'Project {{p_0}} is enabled successfully'
				},
				projectAlreadyEnabled: {
					location: projectMainModule,
					identifier: 'projectAlreadyEnabled',
					param: {prj: ''},
					initial: 'Project {{p_0}} is already enabled'
				},
				noCurrentSelection: {
					location: cloudCommonModule,
					identifier: 'noCurrentSelection',
					initial: 'No project selected. Nothing done'
				},
				doneSuccessfully: {
					location: cloudCommonModule,
					identifier: 'doneSuccessfully',
					initial: 'Done successfully'
				},
				entitySetActive: {location: projectMainModule, identifier: 'entitySetActive', initial: 'Set Active'},
				entityResponsible: {
					location: cloudCommonModule,
					identifier: 'entityResponsible',
					initial: 'Responsible'
				},
				entity5DProject: {location: projectMainModule, identifier: 'entity5DProject', initial: '5D Project'},
				listCurrencyConversionTitle: {
					location: basicsCurrencyModule,
					identifier: 'CurrencyConversion',
					initial: 'Currency Conversions'
				},
				CurrencyForeignFk: {
					location: basicsCurrencyModule,
					identifier: 'ForeignCurrency',
					initial: 'Foreign Currency'
				},
				CurrencyHomeFk: {location: basicsCurrencyModule, identifier: 'HomeCurrency', initial: 'Home Currency'},
				CurrencyForeignNameFk: {
					location: basicsCurrencyModule,
					identifier: 'ForeignCurrencyName',
					initial: 'Name'
				},
				Basis: {location: basicsCurrencyModule, identifier: 'Basis', initial: 'Basis'},
				listCurrencyRateTitle: {
					location: basicsCurrencyModule,
					identifier: 'ExchangeRates',
					initial: 'Exchange Rates'
				},
				CurrencyRateTypeFk: {location: basicsCurrencyModule, identifier: 'RateType', initial: 'Rate Type'},
				CurrencyConversionFk: {
					location: basicsCurrencyModule,
					identifier: 'CurrencyConversion',
					initial: 'Currency Conversion'
				},
				RateDate: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
				Rate: {location: cloudCommonModule, identifier: 'entityRate', initial: 'Rate'},
				estimate: {location: projectMainModule, identifier: 'estimate', initial: 'Estimate'},
				costcodesTitle: {location: projectCostCodesModule, identifier: 'costCodes', initial: 'Cost Codes'},
				costcodesDetails: {
					location: projectCostCodesModule,
					identifier: 'costCodesDetails',
					initial: 'Details Cost Code'
				},
				entityTranslationTitle: {
					location: cloudCommonModule,
					identifier: 'entityTranslation',
					initial: 'Translation'
				},
				characteristicTitle: {
					location: cloudCommonModule,
					identifier: 'characteristicTitle',
					initial: 'Characteristics'
				},
				entityCostGroup1: {
					location: projectMainModule,
					identifier: 'entityCostGroup1',
					initial: 'Cost Group 1'
				},
				entityCostGroup2: {
					location: projectMainModule,
					identifier: 'entityCostGroup2',
					initial: 'Cost Group 2'
				},
				entityCostGroup3: {
					location: projectMainModule,
					identifier: 'entityCostGroup3',
					initial: 'Cost Group 3'
				},
				entityCostGroup4: {
					location: projectMainModule,
					identifier: 'entityCostGroup4',
					initial: 'Cost Group 4'
				},
				entityCostGroup5: {
					location: projectMainModule,
					identifier: 'entityCostGroup5',
					initial: 'Cost Group 5'
				},
				entityChange: {location: projectMainModule, identifier: 'entityChange', initial: 'Change'},
				entityCurrencyConversion: {
					location: projectMainModule,
					identifier: 'entityCurrencyConversion',
					initial: 'Currencyconversion'
				},
				GeneralstypeFk: {
					location: projectMainModule,
					identifier: 'entityGeneralstype',
					initial: 'Generalstype'
				},
				Value: {location: projectMainModule, identifier: 'entityValue', initial: 'Value'},
				ValueType: {location: basicsCustomizeModule, identifier: 'valuetype', initial: 'Value Type'},
				CommentText: {location: projectMainModule, identifier: 'entityCommentText', initial: 'Comment Text'},
				StadiumFk: {location: projectMainModule, identifier: 'entityStadiumFk', initial: 'Stadium'},
				BusinesspartnerFk: {
					location: projectMainModule,
					identifier: 'entityBusinesspartnerFk',
					initial: 'Businesspartner'
				},
				Rank: {location: projectMainModule, identifier: 'entityRank', initial: 'Stadium'},
				IsActive: {location: projectMainModule, identifier: 'entityIsActive', initial: 'Stadium'},
				Quotation: {location: projectMainModule, identifier: 'entityQuotation', initial: 'Quotation'},
				Discount: {location: projectMainModule, identifier: 'entityDiscount', initial: 'Discount'},
				GlobalPercentage: {
					location: projectMainModule,
					identifier: 'entityGlobalPercentage',
					initial: 'Global Percentage'
				},
				OtherDiscount: {
					location: projectMainModule,
					identifier: 'entityOtherDiscount',
					initial: 'Other Discount'
				},
				FinalQuotation: {
					location: projectMainModule,
					identifier: 'entityFinalQuotation',
					initial: 'Final Quotation'
				},
				NumberProposals: {
					location: projectMainModule,
					identifier: 'entityNumberProposals',
					initial: 'Number Proposals'
				},
				defaultContainerTitle: {
					location: basicsUserFormModule,
					identifier: 'defaultContainerTitle',
					initial: 'Form Data'
				},
				ControllingUnitTemplateFk: {
					location: projectMainModule,
					identifier: 'controllingUnitTemplate',
					initial: 'Controlling Unit Template'
				},
				ControltemplateFk: {location: projectMainModule, identifier: 'controllingTemplate', initial: 'Controlling Template'},
				RoleFk: {location: projectMainModule, identifier: 'entityRole', initial: 'Role'},
				Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
				IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
				ClosingDate: {location: projectMainModule, identifier: 'entityClosingDate', initial: 'Closing Date'},
				ClosingTime: {location: projectMainModule, identifier: 'entityClosingTime', initial: 'Closing Time'},
				DecisionFk: {location: projectMainModule, identifier: 'entityDecisionFk', initial: 'Decision'},
				ChancesFk: {location: projectMainModule, identifier: 'entityChancesFk', initial: 'Chances'},
				ProfitPercent: {
					location: projectMainModule,
					identifier: 'entityProfitPercent',
					initial: 'Profit Percent'
				},
				Volume: {location: projectMainModule, identifier: 'entityVolume', initial: 'Volume'},
				OutcomeFk: {location: projectMainModule, identifier: 'entityOutcomeFk', initial: 'Outcome'},
				RemarkOutcome: {
					location: projectMainModule,
					identifier: 'entityRemarkOutcome',
					initial: 'Remark Outcome'
				},
				ValuationLowest: {
					location: projectMainModule,
					identifier: 'entityValuationLowest',
					initial: 'Lowest Valuation'
				},
				ValuationHighest: {
					location: projectMainModule,
					identifier: 'entityValuationHighest',
					initial: 'Highest Valuation'
				},
				ValuationOwn: {location: projectMainModule, identifier: 'entityValuationOwn', initial: 'Own Valuation'},
				ValuationDifference: {
					location: projectMainModule,
					identifier: 'entityValuationDifference',
					initial: 'Difference Valuation'
				},
				Remark01: {location: projectMainModule, identifier: 'entityRemark01', initial: 'Remark 01'},
				Remark02: {location: projectMainModule, identifier: 'entityRemark02', initial: 'Remark 02'},
				Remark03: {location: projectMainModule, identifier: 'entityRemark03', initial: 'Remark 03'},
				Remark04: {location: projectMainModule, identifier: 'entityRemark04', initial: 'Remark 04'},
				Remark05: {location: projectMainModule, identifier: 'entityRemark05', initial: 'Remark 05'},
				KeyFigureFk: {location: projectMainModule, identifier: 'entityKeyFigure', initial: 'Key Figure'},
				KeyFigureValue: {
					location: projectMainModule,
					identifier: 'entityKeyFigureValue',
					initial: 'Key Figure Value'
				},
				TelephoneNumberFk: {
					location: cloudCommonModule,
					identifier: 'TelephoneDialogPhoneNumber',
					initial: 'Telephone Number'
				},
				TelephoneNumber2Fk: {
					location: businessPartnerMain,
					identifier: 'telephoneNumber2',
					initial: 'Other Tel.'
				},
				TelephoneTelefaxFk: {location: cloudCommonModule, identifier: 'fax', initial: 'Telephone Telefax'},
				TelephoneMobilFk: {location: cloudCommonModule, identifier: 'mobile', initial: 'Telephone Mobil'},
				TelephoneNumberMobileFk: {location: cloudCommonModule, identifier: 'mobile', initial: 'Telephone Mobil'},
				TelephonePrivatFk: {location: cloudCommonModule, identifier: 'TelephonePrivat', initial: 'Telephone Private'},
				TelephonePrivatMobilFk: {location: cloudCommonModule, identifier: 'TelephonePrivatMobil', initial: 'Telephone Private Mobile'},

				Email: {location: cloudCommonModule, identifier: 'email', initial: 'Email'},
				SupplierNo: {location: businessPartnerMain, identifier: 'supplierNo', initial: 'SupplierNo'},
				FirstName: {location: basicsClerk, identifier: 'entityFirstName', initial: 'First Name'},
				FamilyName: {location: basicsClerk, identifier: 'entityFamilyName', initial: 'Family Name'},
				entityProjectRemark: {
					location: projectMainModule,
					identifier: 'entityProjectRemark',
					initial: 'Project Remark'
				},
				listObjectProjectHeaderTitle:{location: objectMainModule, identifier: 'listObjectProjectHeaderTitle', initial: 'Project Headers'},
				detailObjectProjectHeaderTitle:{location: objectMainModule, identifier: 'detailObjectProjectHeaderTitle', initial: 'Project Header'},
				listObjectProjectLevelTitle:{location: objectMainModule, identifier: 'listObjectProjectLevelTitle', initial: 'Project Levels'},
				detailObjectProjectLevelTitle:{location: objectMainModule, identifier: 'detailObjectProjectLevelTitle', initial: 'Project Level'},
				PublishedForCompanyTitle : { location: projectMainModule, identifier: 'publishedForCompanyTitle', initial: 'Published Company Header' },
				AssetMasterFk: { location: estimateMainModule, identifier: 'mdcAssetMasterFk', initial: 'Asset Master'},
				IsGenerated: {location: cloudCommonModule, identifier: 'isGenerated', initial: 'IsGenerated'},
				IsTemplate: {location: projectMainModule, identifier: 'isTemplate', initial: 'Is Template'},
				PrjContentTypeFk: {location: projectMainModule, identifier: 'prjContentTypeFk', initial: 'Content Type'},
				IsChecked: {location: projectMainModule, identifier: 'isChecked', initial: 'Checked'},
				Checked: {location: basicsCustomizeModule, identifier: 'ispublished', initial: 'Published'},
				PriceListType: {location: projectMainModule, identifier: 'priceListType', initial: 'Price List'},
				AccessObjectTypeFk:{location: projectMainModule, identifier: 'accessObjectTypeFk', initial: 'Access Object Type'},
				AccessRoleFk:{location: projectMainModule, identifier: 'accessRole', initial: 'Access Role'},
				AccessGroupFk:{location: projectMainModule, identifier: 'accessGroup', initial: 'Access Group'},
				makeProjectTo5DTitle: { location: projectMainModule, identifier: 'makeProjectTo5DTitle', initial: 'Convert Into 5D-Project' },
				projectIsConvertedInto5DProject: { location: projectMainModule, identifier: 'projectIsConvertedInto5DProject', initial: 'Project has been converted into 5D-Project' },
				projectAlreadyIs5DProject: { location: projectMainModule, identifier: 'projectAlreadyIs5DProject', initial: 'Project is already 5D-Project' },
				makeProjectTo40Title: { location: projectMainModule, identifier: 'makeProjectTo40Title', initial: 'Convert Into 40-Project' },
				projectIsConvertedInto40Project: { location: projectMainModule, identifier: 'projectIsConvertedInto40Project', initial: 'Project has been converted into 40-Project' },
				projectAlreadyIs40Project: { location: projectMainModule, identifier: 'projectAlreadyIs40Project', initial: 'Project is already 40-Project' },
				commentText:{ location: projectMainModule, identifier: 'commentText', initial: 'Comment Text' },
				AddressTypeFk:{ location: projectMainModule, identifier: 'AddressTypeFk', initial: 'Address Type' },
				productionplanningHeader:{ location: productionplanningCommonModule, identifier: 'header.listTitle', initial: 'Production Planning Header' },
				productionplanningEvents:{ location: productionplanningCommonModule, identifier: 'event.headerEventTitle', initial: 'Production Planning Events' },
				productionplanningMountingRequisitions:{ location: productionplanningMountingModule, identifier: 'requisition.listTitle', initial: 'Mounting Requisitions' },
				productionplanningMountingRequisition:{ location: productionplanningMountingModule, identifier: 'requisition.detailTitle', initial: 'Mounting Requisition Details' },
				PrcStructureFk:{location: projectMainModule, identifier: 'prcStructureFk', initial: 'Procurement Structure'},
				CertificateTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				IsRequired: { location: projectMainModule, identifier: 'isRequired', initial: 'Is Required'},
				IsMandatory: { location: projectMainModule, identifier: 'isMandatory', initial: 'Is Mandatory'},
				IsRequiredSub: { location: projectMainModule, identifier: 'isRequiredSub', initial: 'Is Required Sub'},
				IsMandatorySub: { location: projectMainModule, identifier: 'isMandatorySub', initial: 'Is Mandatory Sub'},
				LanguageContractFk: { location: basicsCustomizeModule, identifier: 'language', initial: 'Language'},
				ReleaseDate: {location: projectMainModule, identifier: 'releaseDate', initial: 'Release Date'},
				IsAdministration: {location: projectMainModule, identifier: 'isAdministration', initial: 'Is Administration'},
				IsInterCompany: {location: projectMainModule, identifier: 'isInterCompany', initial: 'Publish'},
				CompanyName : { location: projectMainModule, identifier: 'companyName', initial: 'Company Name' },
				DateEffective:{location: basicsCommonModule, identifier: 'dateEffective', initial: 'Date Effective'},
				ProjectContactRoleTypeFk: {location: basicsCustomizeModule, identifier: 'projectcontractroletype' },
				PropertyKeyFk: { location: modelProjectModule, identifier: 'propertyKey', initial: 'Property Key' },
				ProjectFk: { location: modelProjectModule, identifier: 'project', initial: 'Project' },
				RubricCatLocationFk: { location: projectMainModule, identifier: 'entityRubricLocation', initial: 'Rubric Category for Locations' },
				ReferenceQuantityCode: {location: basicsCostGroupsModule, identifier: 'referenceQuantityCode', initial: 'Reference Quantity'},
				QuantityPortion: { location: projectMainModule, identifier: 'quantityPortion', initial: 'Quantity Portion (in %)'},
				PrjCategoryFk:  { location: projectMainModule, identifier: 'prjCategory'},
				PrjClassificationFk:  { location: projectMainModule, identifier: 'prjClassification'},
				PrjKindFk:  { location: projectMainModule, identifier: 'prjKind'},
				TotalQuantity: { location: cloudCommonModule, identifier: 'entityTotal' },
				ControllingUnitFk: { location: projectMainModule, identifier: 'entityControllingUnit' },
				ActivityFk: { location: projectMainModule, identifier: 'entityActivity' },
				ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom' },
				ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo' },
				IsDiaryRelevant: { location: projectMainModule, identifier: 'entityIsDiaryRelevant' },
				ActionTypeFk: { location: projectMainModule, identifier: 'entityActionType' },
				Comment: {location: projectMainModule, identifier: 'entityCommentText', initial: 'Comment Text'},
				CatalogConfigTypeFk: { location: projectMainModule, identifier: 'costGroupConfiguration' },
				NoLeadQuantity: {location: basicsCostGroupsModule, identifier: 'noleadquantity', initial: 'No Lead Quantity'},
				LeadQuantityCalc: {location: basicsCostGroupsModule, identifier: 'leadquantitycalc', initial: 'Calculate Lead Quantity'},
				LogisticJobFk: {location: logisticJobModule, identifier: 'entityJob', initial: 'Job'},
				RubricCategorySalesFk: { location: projectMainModule, identifier: 'entityRubricSales', initial: 'Rubric Category for Sales' },
				SaleFk: { location: projectMainModule, identifier: 'entityProjectSale', initial: 'Sale' },
				QuantityControlFk: { location: basicsCustomizeModule, identifier: 'projectquantitycontrol'},
				IsBiddingConsortium: { location: projectMainModule, identifier: 'isBiddingConsortium' },
				BusinessPartner: { location: projectMainModule, identifier: 'businessPartnerText' },
				RubricCategoryControllingUnitFk: { location: projectMainModule, identifier: 'entityRubricCategoryControllingUnitFk' },
				EmployeeFk: { location: timekeepingCommonModule, identifier: 'employee' },
				SalesTaxCodeFk: { location: projectMainModule, identifier: 'SalesTaxCodeEntity' },
				TaxPercent: { location: projectMainModule, identifier: 'TaxPercentEntity' },
				PrjTaxPercent: { location: projectMainModule, identifier: 'PrjTaxPercentEntity' },
				SalesTaxGroupFk: { location: projectMainModule, identifier: 'SalesTaxGroupEntity' },
				IsCompletePerformance: { location: projectMainModule, identifier: 'isCompletePerformance' },
				Zipcode:{location:cloudCommonModule,identifier:'entityZipCode'},
				AddressLine:{location:cloudCommonModule,identifier:'entityDeliveryAddress'},
				Address:{location:cloudCommonModule,identifier:'entityAddress'},
				ProjectOriginFk: { location: projectMainModule, identifier: 'originalProject' },
				LocationFk: { location: locationModule, identifier: 'location' },
				ProjectModeFk: { location: basicsCustomizeModule, identifier: 'projectmode' },
				BasCurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency' },
				ProjectGroupFk: {location: projectGroupModule, identifier: 'entityProjectGroup', initial: 'Project Group'},
				ProjectChangeFk: {location: cloudCommonModule, identifier: 'entityProjectChange', initial:'Project Change'},
				PlantComponentFk: { location: resourceEquipmentModule, identifier: 'entityPlantComponent' ,initial:'Plant Component'},
				JobPlantAllocationFk: { location: projectMainModule, identifier: 'entityChange', initial: 'Job plant Allocation' },
				JobDescription: { location: resourceEquipmentModule, identifier: 'entityJobDescription', initial:'Job Description' },
				WorkOperationTypeFk: { location: resourceEquipmentModule, identifier: 'entityWorkOperationTypeFk' ,initial:'Work Operation Type'},
				DispatchHeaderInFk: { location: resourceEquipmentModule, identifier: 'entityDispatchHeaderInFk' ,initial:'Dispatch Header'},
				JobFk: { location: projectCostCodesModule, identifier: 'lgmJobFk' ,initial:'Job'},
				PlantFk: { location: resourceEquipmentModule, identifier: 'entityPlant',initial:'Plant' },
				TrafficLightFk: { location: resourceEquipmentModule, identifier: 'trafficlight,',initial:'Traffic Light' },
				PlantTypeFk: { location: resourceEquipmentModule, identifier: 'plantType', initial: 'Plant Type' },
				PlantComponentTypeFk: { location: resourceEquipmentModule, identifier: 'entityPlantComponentTypeFk', initial: 'Plant Component Type' },
				AllocatedFrom: { location: logisticJobModule, identifier: 'allocatedFrom', initial: 'Allocated From' },
				AllocatedTo: { location: logisticJobModule, identifier: 'allocatedTo', initial: 'Allocated To' },
				SerialNumber: { location: resourceEquipmentModule, identifier: 'entitySerialNumber', initial: 'Serial Number' },
				PlantGroupFk: { location: resourceEquipmentModule, identifier: 'entityResourceEquipmentGroup',initial:'Plant Group' },
				EmployeeGroupFk: { location: projectMainModule, identifier: 'entityEmplyoeeGroup',initial:'Employee Group' },
				ProfessionalCategoryFk: { location: projectMainModule, identifier: 'entityProfessionalCategory',initial:'Professional Category' },
				IsEstimateBoqDriven: { location: projectMainModule, identifier: 'isEstimateBoqDriven'},
				RubricCategoryBillToFk: { location: projectMainModule, identifier: 'rubricCategoryBillTo'},
				Deviation : { location: projectMainModule, identifier: 'entityDeviation'},
				ValuePercent: { location: projectMainModule, identifier: 'entityValuePercent'},
				ActivityTypeFk:{location: projectMainModule, identifier: 'entityActivityType'},
				ActivityDate:{location: projectMainModule, identifier: 'entityActivityDate'},
				ClerkFk:{location: projectMainModule, identifier: 'entityClerk'},
				DocumentTypeFk:{location: projectMainModule, identifier: 'entityDocumentType'},
				DocumentName:{location: projectMainModule, identifier: 'entityDocumentName'},
				DocumentDate:{location: projectMainModule, identifier: 'entityDocumentDate'},
				FromDate:{location: projectMainModule, identifier: 'entityFromDate'},
				ReminderCycleFk:{location: projectMainModule, identifier: 'entityReminderCycle'},
				ReminderFrequency:{location: projectMainModule, identifier: 'entityReminderFrequency'},
				ReminderStartDate:{location: projectMainModule, identifier: 'entityReminderStartDate'},
				ReminderEndDate:{location: projectMainModule, identifier: 'entityReminderEndDate'},
				ReminderNextDate:{location: projectMainModule, identifier: 'entityReminderNextDate'},
				IsFinished: { location: projectMainModule, identifier: 'entityIsFinished'},
				OriginFileName: { location: cloudCommonModule, identifier: 'documentOriginFileName' },
				PreliminaryDelivery: { location: projectMainModule, identifier: 'preliminaryDelivery'},
				FinalDelivery: { location: projectMainModule, identifier: 'finalDelivery'},
				EndAfterTermExtension: { location: projectMainModule, identifier: 'endAfterTermExtension'},
				StartAccordingInjunction: { location: projectMainModule, identifier: 'startAccordingInjunction'},
				OrderDate: { location: projectMainModule, identifier: 'orderDate'},
				StartExecution: { location: projectMainModule, identifier: 'startExecution'},
				EndExecution: { location: projectMainModule, identifier: 'endExecution'},
				DurationTermExtension: { location: projectMainModule, identifier: 'durationTermExtension'},
				DelayInDays: { location: projectMainModule, identifier: 'delayInDays'},
				executionGroup: {location: projectMainModule, identifier: 'executionGroup'},
				PictureDate: { location: projectMainModule, identifier: 'entityPictureDate' },
				IsHiddenInPublicApi: { location: projectMainModule, identifier: 'isHiddenInPublicApi' }
			};

			service.getProjectData = function getProjectData() {
				return data;
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0', 'userDefNumberGroup');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
			salesBidProjectTranslationService.addSalesBidTranslationsForProject(data.words);
			salesBillingProjectTranslationService.addSalesBillingTranslationsForProject(data.words);
			salesContractProjectTranslationService.addSalesContractTranslationsForProject(data.words);
			salesWipProjectTranslationService.addSalesWipTranslationsForProject(data.words);
			schedulingScheduleTranslationService.addScheduleBasicWords(data.words);
			projectStockTranslationService.provideProjectStockContainerTitle(data.words);
			platformTranslationUtilitiesService.addModelAndSimulationTranslation(data.words, true);// true -> include models
			bpCertificateProjectTranslationService.addCertificateTranslationsForProject(data.words);

			// Convert word list into a format used by platform translation service
			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
