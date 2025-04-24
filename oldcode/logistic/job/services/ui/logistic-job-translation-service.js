(function (angular) {
	'use strict';

	let logisticJobModule = 'logistic.job';
	let logisticCardModule = 'logistic.card';
	let logisticSundryServiceModule = 'logistic.sundryservice';
	/*

	let resRequisitionModule = 'resource.requisition';
*/
	const cloudCommonModule = 'cloud.common';
	const logisticCommonModule = 'logistic.common';
	const basicsCustomizeModule = 'basics.customize';
	const basicsMaterialModule = 'basics.material';
	const basicsCostCodesModule = 'basics.costcodes';
	const resRequisitionModule = 'resource.requisition';
	const resReservationModule = 'resource.reservation';
	const resCommonModule = 'resource.common';
	const equipmentModule = 'resource.equipment';
	const projectMainModule = 'project.main';

	/**
	 * @ngdoc service
	 * @name logisticJobTranslationService
	 * @description provides translation for logistic module
	 */
	angular.module(logisticJobModule).factory('logisticJobTranslationService', ['_', 'platformTranslationUtilitiesService',

		function (_, platformTranslationUtilitiesService) {
			let service = {};
			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [logisticJobModule, logisticCardModule, logisticSundryServiceModule, cloudCommonModule, basicsCustomizeModule, basicsMaterialModule, basicsCostCodesModule,
					resReservationModule, resRequisitionModule, 'resource.catalog',resCommonModule,equipmentModule, logisticCommonModule]
			};
			let modules = ['logistic', 'resource', 'services', 'project', 'basics'];
			data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

			data.words = {
				listJobTitle: {location: logisticJobModule, identifier: 'listJobTitle'},
				detailJobTitle: {location: logisticJobModule, identifier: 'listJobTitle'},
				DivisionFk: {
					location: basicsCustomizeModule,
					identifier: 'equipmentdivision'
				},
				basicData: {location: cloudCommonModule, identifier: 'entityProperties'},
				Code: {location: cloudCommonModule, identifier: 'entityCode'},
				Description: {location: cloudCommonModule, identifier: 'entityDesciption'},
				DescriptionInfo: { location: cloudCommonModule, identifier: 'descriptionInfo', initial: 'Description' },
				ValidFrom: {location: cloudCommonModule, identifier: 'entityValidFrom'},
				ValidTo: {location: cloudCommonModule, identifier: 'entityValidTo'},
				JobTypeFk: {location: basicsCustomizeModule, identifier: 'jobtype'},
				ProjectFk: {location: cloudCommonModule, identifier: 'entityProject'},
				ControllingUnitFk: {
					location: cloudCommonModule,
					identifier: 'entityControllingUnit'
				},
				CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany'},
				JobGroupFk: {location: basicsCustomizeModule, identifier: 'jobgroup'},
				JobStatusFk: {location: basicsCustomizeModule, identifier: 'jobstatus'},
				BusinessPartnerFk: {
					location: cloudCommonModule,
					identifier: 'businessPartner'
				},
				RubricCategoryFk: {
					location: cloudCommonModule,
					identifier: 'entityBaseRubricCategoryFk'
				},
				IsLive: {location: cloudCommonModule, identifier: 'entityIsLive'},
				AddressFk: {location: cloudCommonModule, identifier: 'entityDeliveryAddress'},
				SubsidiaryFk: {location: cloudCommonModule, identifier: 'entitySubsidiary'},
				CustomerFk: {location: logisticJobModule, identifier: 'entityCustomer'},
				CommentText: {location: cloudCommonModule, identifier: 'entityCommentText'},
				Barcode: {location: logisticJobModule, identifier: 'entityBarcode'},
				FileArchiveDocFk: {
					location: logisticJobModule,
					identifier: 'entityFileArchiveDoc'
				},
				DocumentTypeFk: {location: basicsCustomizeModule, identifier: 'documenttype'},
				JobDocumentTypeFk: {
					location: basicsCustomizeModule,
					identifier: 'jobdocumenttype'
				},
				OriginFileName: {
					location: cloudCommonModule,
					identifier: 'documentOriginFileName'
				},
				Date: {location: cloudCommonModule, identifier: 'entityDate'},
				EquipmentCatalogFk: {location: logisticJobModule, identifier: 'equipmentCatalog'},
				EquipmentPriceListFk: {location: logisticJobModule, identifier: 'equipmentPriceList'},
				MaterialCatalogFk: {location: logisticJobModule, identifier: 'materialCatalog'},
				MaterialCatalogTypeFk: {location: cloudCommonModule, identifier: 'entityType'},
				MaterialDiscountGrpFk: {
					location: basicsMaterialModule,
					identifier: 'record.discountGroup'
				},
				TaxCodeFk: {location: cloudCommonModule, identifier: 'entityTaxCode'},
				CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency'},
				MaterialFk: {location: basicsMaterialModule, identifier: 'record.material'},
				MaterialGroupFk: {
					location: basicsMaterialModule,
					identifier: 'record.materialGroup'
				},
				RetailPrice: {location: basicsMaterialModule, identifier: 'record.retailPrice'},
				ListPrice: {location: basicsMaterialModule, identifier: 'record.listPrice'},
				Discount: {location: basicsMaterialModule, identifier: 'record.discount'},
				Charges: {location: basicsMaterialModule, identifier: 'record.charges'},
				Cost: {location: basicsMaterialModule, identifier: 'record.costPrice'},
				PriceConditionFk: {
					location: cloudCommonModule,
					identifier: 'entityPriceCondition'
				},
				PriceExtra: {location: basicsMaterialModule, identifier: 'record.priceExtras'},
				EstimatePrice: {location: basicsMaterialModule, identifier: 'record.estimatePrice'},
				PriceUnit: {location: cloudCommonModule, identifier: 'entityPriceUnit'},
				UomPriceUnitFk: {location: cloudCommonModule, identifier: 'entityPriceUnitUoM'},
				FactorPriceUnit: {location: logisticJobModule, identifier: 'factorPriceUnit'},
				CostTypeFk: {location: basicsMaterialModule, identifier: 'record.estCostTypeFk'},
				CostCodeFk: {location: logisticJobModule, identifier: 'entityCostCode'},
				Rate: {location: logisticCommonModule, identifier: 'costCodeRate'},
				Extra: {location: logisticJobModule, identifier: 'entityExtra'},
				Surcharge: {location: logisticJobModule, identifier: 'entitySurcharge'},
				Contribution: {location: logisticJobModule, identifier: 'entityContribution'},
				SalesPrice: {location: basicsCostCodesModule, identifier: 'priceList.salesPrice'},
				FactorCosts: {location: basicsCostCodesModule, identifier: 'factorCosts'},
				RealFactorCosts: {
					location: basicsCostCodesModule,
					identifier: 'realFactorCosts'
				},
				FactorQuantity: {
					location: basicsCostCodesModule,
					identifier: 'factorQuantity'
				},
				RealFactorQuantity: {
					location: basicsCostCodesModule,
					identifier: 'realFactorQuantity'
				},
				IsLabour: {location: basicsCostCodesModule, identifier: 'isLabour'},
				IsRate: {location: basicsCostCodesModule, identifier: 'isRate'},
				Remark: {location: cloudCommonModule, identifier: 'entityRemark'},
				IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault'},
				UomFk: {location: cloudCommonModule, identifier: 'entityUoM'},
				JobPerformingFk: {location: logisticJobModule, identifier: 'entityJobPerforming'},
				CostCodePriceListFk: { location: logisticJobModule, identifier: 'costCodePriceList'},
				PriceConditionTypeFk: {
					location: logisticJobModule,
					identifier: 'priceConditionType'
				},
				Value: {location: cloudCommonModule, identifier: 'priceValue'},
				Total: {location: cloudCommonModule, identifier: 'priceTotal'},
				TotalOc: {location: cloudCommonModule, identifier: 'priceTotalOc'},
				IsPriceComponent: {location: logisticJobModule, identifier: 'isPriceComponent'},
				IsActivated: {location: logisticJobModule, identifier: 'isActivated'},
				PricePortion1: {location: logisticJobModule, identifier: 'pricePortion1'},
				PricePortion2: {location: logisticJobModule, identifier: 'pricePortion2'},
				PricePortion3: {location: logisticJobModule, identifier: 'pricePortion3'},
				PricePortion4: {location: logisticJobModule, identifier: 'pricePortion4'},
				PricePortion5: {location: logisticJobModule, identifier: 'pricePortion5'},
				PricePortion6: {location: logisticJobModule, identifier: 'pricePortion6'},
				CostCodePriceVersionFk: {location: logisticJobModule, identifier: 'costCodePriceVersion'},
				MaterialPriceVersionFk: {location: logisticJobModule, identifier: 'materialPriceVersion'},
				WorkOperationTypeFk: {location: logisticJobModule, identifier: 'workOperationType'},
				IsManual: {location: logisticJobModule, identifier: 'isManual'},
				SundryServiceFk: {location: logisticJobModule, identifier: 'sundryServiceFk'},
				PlantFk: {location: logisticJobModule, identifier:'plant'},
				Priority: {location: logisticJobModule, identifier:'priority'},
				MaterialPriceListFk: {location: logisticJobModule, identifier:'entityMaterialPriceList'},
				SundryPriceListFk: {location: logisticJobModule, identifier:'priceList'},
				PriceListFk: {location: logisticJobModule, identifier:'priceList'},
				FactorHour:{location: logisticJobModule, identifier:'factorHour'},
				AddressPrjFk: {location: logisticJobModule, identifier: 'addressPrj'},
				CalendarFk: {location: cloudCommonModule, identifier: 'entityCalCalendarFk'},
				AllocatedFrom: {location: logisticJobModule, identifier:'allocatedFrom'},
				AllocatedTo: {location: logisticJobModule, identifier:'allocatedTo'},
				dispatchNoteInformation: {location: logisticJobModule, identifier: 'dispatchNoteInformation'},
				ReleaseDate: {location: logisticJobModule, identifier: 'releaseDate'},
				DispatchHeaderInCode: {location: logisticJobModule, identifier: 'dispatchHeaderIn'},
				DispatchHeaderInDesc: {location: logisticJobModule, identifier: 'dispatchHeaderInDesc'},
				DispatchHeaderInComment: {location: logisticJobModule, identifier: 'dispatchHeaderInComment'},
				CompanyInCode: {location: logisticJobModule, identifier: 'companyIn'},
				CompanyInName: {location: logisticJobModule, identifier: 'companyInName'},
				DispatchHeaderOutCode: {location: logisticJobModule, identifier: 'dispatchHeaderOut'},
				DispatchHeaderOutDesc: {location: logisticJobModule, identifier: 'dispatchHeaderOutDesc'},
				DispatchHeaderOutComment: {location: logisticJobModule, identifier: 'dispatchHeaderOutComment'},
				CompanyOutCode: {location: logisticJobModule, identifier: 'companyOut'},
				CompanyOutName: {location: logisticJobModule, identifier: 'companyOutName'},
				ReservationFk: {location: resReservationModule, identifier: 'entityReservation'},
				DeliveryAddressContactFk: {location: logisticJobModule, identifier: 'deliveryAddressContact'},
				EvaluationOrder: {location: logisticJobModule, identifier: 'evaluationOrder'},
				PlantTypeFk: {location: basicsCustomizeModule, identifier: 'planttype'},
				JobTaskTypeFk: {location: logisticJobModule, identifier: 'jobTaskType'},
				PrcItemFk: {location: logisticJobModule, identifier: 'prcItemFk'},
				InvOtherFk: {location: logisticJobModule, identifier: 'invOtherFk'},
				IsMaintenance: { location: basicsCustomizeModule, identifier: 'ismaintenance'},
				ArticleFk: { location: logisticJobModule, identifier: 'entityArticleCode' },
				Quantity: { location: cloudCommonModule, identifier: 'entityQuantity' },
				ItemQuantity: { location: logisticJobModule, identifier: 'quantity' },
				ItemPriceUnit: { location: logisticJobModule, identifier: 'unitPrice' },
				ItemPriceTotal: { location: logisticJobModule, identifier: 'total' },
				ArticleDescription: { location: logisticJobModule, identifier: 'entityArticleDescription' },
				PlantGroupFk: { location: logisticJobModule, identifier: 'plantGroup'},
				SettledByTypeFk: { location: logisticJobModule, identifier: 'settledByType'},
				pricing: { location: cloudCommonModule, identifier: 'entityPriceCondition'},
				customer: { location: cloudCommonModule, identifier: 'entityCustomer'},
				LastSettlementDate: {location: logisticJobModule, identifier: 'lastSettlementDate'},
				IsBulk: {location: basicsCustomizeModule, identifier: 'isBulk'},
				PrjStockFk: {location: logisticJobModule, identifier: 'entityStock'},
				IsFromPes: {location: logisticJobModule, identifier: 'entityPesItemFk'},
				ProjectName: {location: cloudCommonModule, identifier: 'entityProjectName'},
				ProjectNo: {location: cloudCommonModule, identifier: 'entityProjectNo'},
				PlantIsBulk: {location: logisticJobModule, identifier: 'plantIsBulkEntity'},
				CompanyCode: {location: logisticJobModule, identifier: 'plantLocation2CompanyCodeEntity'},
				CompanyName: {location: logisticJobModule, identifier: 'plantLocation2CompanyNameEntity'},
				PlantComponentFk: {location: equipmentModule, identifier: 'entitySerialNumber'},
				CostCodeTypeFk: { location: logisticJobModule, identifier: 'costCodeType', initial: 'Type' },
				AbcClassificationFk: { location: basicsCostCodesModule, identifier: 'abcClassification', initial: 'Abc Classification' },
				CostCodePortionsFk: { location: basicsCostCodesModule, identifier: 'costCodePortions', initial: 'CostCodePortions' },
				CostGroupPortionsFk: { location: basicsCostCodesModule, identifier: 'costGroupPortions', initial: 'CostGroupPortions' },
				ProcurementStructureFk: { location: basicsCostCodesModule, identifier: 'prcStructure', initial: 'Procurement Structure'},
				IsBudget : {location: basicsCostCodesModule, identifier: 'isBudget', initial: 'Budget'},
				IsCost : {location: basicsCostCodesModule, identifier: 'isCost', initial: 'Cost'},
				IsChildAllowed : {location: logisticJobModule, identifier: 'isChildAllowed', initial: 'Child Allowed'},
				IsSubContractor : {location: logisticJobModule, identifier: 'isSubContractor', initial: 'SubContractor'},
				ControllingCostCodeFk: { location: basicsCostCodesModule, identifier: 'controllingCostCode', initial: 'Controlling Cost Code' },
				Description2: {location: basicsCostCodesModule, identifier: 'description2', initial: 'Further Description'},
				assignments:{ location: basicsCostCodesModule, identifier: 'assignments', initial: 'Assignments' },
				IncotermFk: {location: logisticJobModule, identifier: 'entityIncoterm'},
				ClerkOwnerFk: {location: logisticJobModule, identifier: 'entityClerkOwner'},
				ClerkResponsibleFk: {location: logisticJobModule, identifier: 'entityClerkResponsible'},
				SiteFk:{location: logisticJobModule, identifier: 'SiteFk'},
				EndWarranty:{location: logisticJobModule, identifier: 'EndWarranty'},
				ContractHeaderFk: {location: logisticJobModule, identifier: 'contractHeaderFk'},
				InvHeaderFk: {location: logisticJobModule, identifier: 'invHeaderFk'},
				JobCardAreaFk:{location: logisticJobModule, identifier: 'jobCardAreaFk'},
				EtmPlantComponentFk: {location: logisticJobModule, identifier: 'entityPlantComponent'},
				PlantDescription: {location: resCommonModule, identifier: 'plantDescription'},
				PlantStatusFk: {location: resCommonModule, identifier: 'plantStatus'},
				DispatchRecordInFk: {location: logisticJobModule, identifier: 'entityDispatchRecordIn'},
				DispatchRecordOutFk: {location: logisticJobModule, identifier: 'entityDispatchRecordOut'},
				PlantEstimatePriceListFk: {location: basicsCustomizeModule, identifier: 'plantestimatepricelist'},
				JobDescription : {location: logisticJobModule, identifier: 'entityJobDescription'},
				JobCode : {location: logisticJobModule, identifier: 'entityJobCode'},
				BillingJobFk: {location: logisticJobModule, identifier: 'entityBillingJob'},
				PlantKindFk: { location: basicsCustomizeModule, identifier: 'plantkind' },
				SerialNumber: { location: equipmentModule, identifier: 'entitySerialNumber', initial: 'Serial Number' },
				HasLoadingCost: { location: logisticJobModule, identifier: 'entityHasLoadingCost', initial: 'Has Loading Costs for Billing Jobs' },
				CalEstimateFk:{ location: logisticJobModule, identifier: 'entityCalEstimate'},
				PricingGroupFk: { location: basicsCustomizeModule, identifier: 'equipmentpricinggroup'},
				CompanyResponsibleFk: {
					location: projectMainModule,
					identifier: 'entityProfitCenter',
					initial: 'Profit Center'
				},
			};
			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0', '');
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			service.getAllUsedModules = function getAllUsedModules (){
				return data.allUsedModules;
			};

			return service;
		}
	]);
})(angular);
