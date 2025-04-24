/**
 * Created by baf on 29.01.2018
 */

(function (angular) {

	'use strict';
	var logisticDispatchingModule = 'logistic.dispatching';
	var basicsCustomizeModule = 'basics.customize';
	var cloudCommonModule = 'cloud.common';
	var logisticJobModule = 'logistic.job';
	var basicsMaterialModule = 'basics.material';
	var resourceWotModule = 'resource.wot';
	var logisticCardModule = 'logistic.card';
	var resourcePlantModule = 'resource.equipment';
	var resourceMasterModule = 'resource.master';
	var resourcePlantGroupModule = 'resource.equipmentgroup';
	let resourceRequisitionModule = 'resource.requisition';
	var transportModule = 'transportplanning.transport';
	let schedulingMainModule = 'scheduling.main';
	let resourceCommonModule = 'resource.common';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingTranslationService
	 * @description provides translation methods for logistic dispatching module
	 */
	angular.module(logisticDispatchingModule).service('logisticDispatchingTranslationService', LogisticDispatchingTranslationService);

	LogisticDispatchingTranslationService.$inject = ['platformTranslationUtilitiesService', '_'];

	function LogisticDispatchingTranslationService(platformTranslationUtilitiesService, _) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticDispatchingModule, basicsCustomizeModule, cloudCommonModule, logisticJobModule, basicsMaterialModule, resourceWotModule,logisticCardModule,
				'logistic.sundryservice','basics.procurementstructure', resourcePlantModule, resourceMasterModule, resourcePlantGroupModule, transportModule]
		};

		data.words = {
			RubricCategoryFk: {
				location: cloudCommonModule,
				identifier: 'entityBasRubricCategoryFk'
			},
			Job1Fk: {location: logisticDispatchingModule, identifier: 'performingJob'},
			Job2Fk: {location: logisticDispatchingModule, identifier: 'receivingJob'},
			DispatchStatusFk: {location: cloudCommonModule, identifier: 'entityState'},
			RecordNo: {location: logisticDispatchingModule, identifier: 'entityRecordNo'},
			WorkOperationTypeFk: {
				location: resourceWotModule,
				identifier: 'entityWorkOperationTypeFk'
			},
			RecordTypeFk: {location: logisticDispatchingModule, identifier: 'recordType'},
			Price: {location: cloudCommonModule, identifier: 'entityPrice'},
			PriceTotal: {location: cloudCommonModule, identifier: 'entityTotal'},
			DocumentDate: {location: logisticDispatchingModule, identifier: 'documentDate'},
			EffectiveDate: {location: logisticDispatchingModule, identifier: 'effectiveDate'},
			PlantFk: {location: logisticCardModule, identifier: 'entityPlant'},
			PrjStockFk: {location: logisticDispatchingModule, identifier: 'entityStock'},
			PrjStockLocationFk: {
				location: logisticDispatchingModule,
				identifier: 'entityStockLocation'
			},
			Lot: {location: logisticDispatchingModule, identifier: 'entityLot'},
			StartDate: {location: cloudCommonModule, identifier: 'entityStartDate'},
			EndDate: {location: cloudCommonModule, identifier: 'entityEndDate'},
			PickingOrder: {location: logisticDispatchingModule, identifier: 'pickingOrder'},
			DeliveredQuantity: {
				location: logisticDispatchingModule,
				identifier: 'deliveredQuantity'
			},
			AcceptedQuantity: {
				location: logisticDispatchingModule,
				identifier: 'acceptedQuantity'
			},
			DispatchRecordStatusFk: {location: cloudCommonModule, identifier: 'entityState'},
			DateEffective: {location: logisticDispatchingModule, identifier: 'effectiveDate'},
			PrcStructureFk: {
				location: logisticDispatchingModule,
				identifier: 'prcStructureFk'
			},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment'},
			SundryServiceFk: {location: logisticDispatchingModule, identifier: 'sundryServiceFk'},
			StockTransactionTypeFk: {
				location: basicsCustomizeModule,
				identifier: 'prcstocktransactiontype'
			},
			MdcCostCodeFk: {location: logisticDispatchingModule, identifier: 'mdcCostCode'},

			DispatchDocumentTypeFk: {
				location: basicsCustomizeModule,
				identifier: 'dispatchheaderdocumenttype'
			},
			DocumentTypeFk: {location: basicsCustomizeModule, identifier: 'documenttype'},
			Date: {location: cloudCommonModule, identifier: 'entityDate'},
			Barcode: {location: logisticJobModule, identifier: 'entityBarcode'},
			DispatchRecordFk: {
				location: logisticDispatchingModule,
				identifier: 'dispatchingRecord'
			},
			ControllingUnitFk: {
				location: cloudCommonModule,
				identifier: 'entityControllingUnit'
			},
			ArticleFk: {location: logisticDispatchingModule, identifier: 'entityArticleCode'},
			DescriptionInfo: {location: basicsCustomizeModule, identifier: 'description1'},
			RecordTypeFkExtend: {location: logisticDispatchingModule, identifier: 'recordType'},
			PerformingProjectFk: {location: logisticDispatchingModule, identifier: 'recordPerformingProject'},
			ReceivingProjectFk: {location: logisticDispatchingModule, identifier: 'recordReceivingProject'},
			PerformingCompanyFk: {location: logisticDispatchingModule, identifier: 'recordPerformingCompany'},
			ReceivingCompanyFk: {location: logisticDispatchingModule, identifier: 'recordReceivingCompany'},
			jobInformation: {location: logisticDispatchingModule, identifier: 'jobInformation'},
			Revenue:{location: logisticDispatchingModule, identifier: 'revenue'},
			PricePortion01: {location: logisticDispatchingModule, identifier: 'pricePortion01'},
			PricePortion02: {location: logisticDispatchingModule, identifier: 'pricePortion02'},
			PricePortion03: {location: logisticDispatchingModule, identifier: 'pricePortion03'},
			PricePortion04: {location: logisticDispatchingModule, identifier: 'pricePortion04'},
			PricePortion05: {location: logisticDispatchingModule, identifier: 'pricePortion05'},
			PricePortion06: {location: logisticDispatchingModule, identifier: 'pricePortion06'},
			StockLocationReceivingFk: {location: logisticDispatchingModule, identifier: 'stockLocationReceivingFk'},
			StockReceivingFk: {location: logisticDispatchingModule, identifier: 'stockReceivingFk'},
			OriginFileName: {location: cloudCommonModule, identifier: 'documentOriginFileName'},
			pricePortions: {location: logisticDispatchingModule, identifier: 'pricePortions'},
			ArticleDesc: {location: logisticDispatchingModule, identifier: 'entityArticleDesc'},
			ExpectedAllocateTo: {location: logisticDispatchingModule, identifier: 'entityExpectedAllocateTo'},
			IsSuccess: {location: logisticDispatchingModule, identifier: 'isSuccess'},
			ExternalNumber: {location: logisticDispatchingModule, identifier: 'externalNumber'},
			LinkageTypeFk: { location: logisticDispatchingModule, identifier: 'dispHeaderLinkType'},
			LinkageReasonFk: { location: logisticDispatchingModule, identifier: 'dispHeaderLinkReason'},
			DispatchHeaderLinkFk: { location: logisticDispatchingModule, identifier: 'linkedDispatchHeader'},
			ProductionHeaderFk: { location: logisticDispatchingModule, identifier: 'productionHeader'},
			MountingActivityFk: { location: logisticDispatchingModule, identifier: 'mountingActivity'},
			TransportRouteFk: { location: logisticDispatchingModule, identifier: 'transportRoute'},
			SettlementFk: { location: logisticDispatchingModule, identifier: 'logisticSettlement'},
			DeliveryAddressContactFk: {location: logisticJobModule, identifier: 'deliveryAddressContact'},
			TksEmployeeFk: {location: logisticDispatchingModule, identifier: 'tksEmployeeFk'},
			DeliveryAddressFk: {location: logisticDispatchingModule, identifier: 'deliveryAddressFk'},
			pricePortionsOc: {location: logisticDispatchingModule, identifier: 'pricePortionsOc'},
			PricePortionOc01: {location: logisticDispatchingModule, identifier: 'pricePortionOc01'},
			PricePortionOc02: {location: logisticDispatchingModule, identifier: 'pricePortionOc02'},
			PricePortionOc03: {location: logisticDispatchingModule, identifier: 'pricePortionOc03'},
			PricePortionOc04: {location: logisticDispatchingModule, identifier: 'pricePortionOc04'},
			PricePortionOc05: {location: logisticDispatchingModule, identifier: 'pricePortionOc05'},
			PricePortionOc06: {location: logisticDispatchingModule, identifier: 'pricePortionOc06'},
			PriceOc: {location: logisticDispatchingModule, identifier: 'priceOc'},
			PriceTotalOc: {location: logisticDispatchingModule, identifier: 'priceTotalOc'},
			ExchangeRate: {location: logisticDispatchingModule, identifier: 'exchangeRate'},
			CurrencyFk: {location: logisticDispatchingModule, identifier: 'currencyFk'},
			DispatchHeaderTypeFk: { location: basicsCustomizeModule, identifier: 'logisticsdispatcherheadertype'},
			IsSettled: { location: logisticDispatchingModule, identifier: 'isSettled' },
			ClerkPickerFk:{ location: logisticDispatchingModule, identifier: 'entityClerkPicker' },
			ClerkDispatcherFk:{ location: logisticDispatchingModule, identifier: 'entityClerkDispatcher' },
			ClerkCurrentFk:{ location: logisticDispatchingModule, identifier: 'entityClerkCurrent' },
			ProjectName: {location: cloudCommonModule, identifier: 'entityProjectName'},
			ProjectNo: {location: cloudCommonModule, identifier: 'entityProjectNo'},
			PlantIsBulk: {location: logisticJobModule, identifier: 'plantIsBulkEntity'},
			PlantGroupFk: { location: logisticJobModule, identifier: 'plantGroup'},
			PlantKindFk: {location: basicsCustomizeModule, identifier: 'plantkind'},
			PlantTypeFk: {location: basicsCustomizeModule, identifier: 'planttype'},
			AllocatedFrom: {location: logisticJobModule, identifier:'allocatedFrom'},
			AllocatedTo: {location: logisticJobModule, identifier:'allocatedTo'},
			UomFk: {location: cloudCommonModule, identifier: 'entityUoM'},
			JobDescription : {location: logisticJobModule, identifier: 'entityJobDescription'},
			JobCode: {location: logisticJobModule, identifier: 'entityJobCode'},
			CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject'},
			JobGroupFk: {location: basicsCustomizeModule, identifier: 'jobgroup'},
			CompanyCode: {location: logisticJobModule, identifier: 'plantLocation2CompanyCodeEntity'},
			CompanyName: {location: logisticJobModule, identifier: 'plantLocation2CompanyNameEntity'},
			PerformingJobGroupFk: { location: logisticDispatchingModule, identifier: 'entityPerformingJobGroup'},
			ReceivingJobGroupFk: { location: logisticDispatchingModule, identifier: 'entityReceivingJobGroup'},
			DispatchActionFk: { location: logisticDispatchingModule, identifier: 'dispatchAction'},
			PlantComponentFk: {location: resourcePlantModule, identifier: 'entitySerialNumber'},
			HomeProjectFk: {location: resourcePlantModule, identifier: 'homeProject'},
			ProjectLocationFk: {location: resourcePlantModule, identifier: 'homeLocation'},
			IncotermFk: {location: logisticDispatchingModule, identifier: 'entityIncoterm'},
			dangerousGoods: { location: logisticDispatchingModule, identifier: 'dangerousGoods' },
			DangerClassFk: { location: logisticDispatchingModule, identifier: 'dangerClass' },
			PackageTypeFk: { location: logisticDispatchingModule, identifier: 'packageType' },
			DangerQuantity: { location: logisticDispatchingModule, identifier: 'dangerQuantity' },
			UomDangerousGoodFk: { location: logisticDispatchingModule, identifier: 'uomDangerousGood' },
			ReceivingProjectLocationFk: { location: logisticDispatchingModule, identifier: 'receivingProjectLocation' },
			PerformingProjectLocationFk: { location: logisticDispatchingModule, identifier: 'performingProjectLocation' },
			RequisitionFk: { location: logisticDispatchingModule, identifier: 'requisition' },
			ResourceRequisitionFk: { location: logisticDispatchingModule, identifier: 'requisition' },
			RequisitionDescription: { location: logisticDispatchingModule, identifier: 'requisitionDescription' },
			RequisitionstatusFk: { location: cloudCommonModule, identifier: 'entityState'},
			ResourceTypeFk: { location: basicsCustomizeModule, identifier: 'resourcetype'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity'},
			RequestedFrom: { location: resourceRequisitionModule, identifier: 'entityRequestedFrom'},
			RequestedTo: { location: resourceRequisitionModule, identifier: 'entityRequestedTo'},
			JobFk: { location: resourceRequisitionModule, identifier: 'entityJob'},
			ActivityFk: { location: schedulingMainModule, identifier: 'activity'},
			TrsRequisitionFk: { location: resourceRequisitionModule, identifier: 'entityTrsRequisitionFk'},
			EventFk: { location: resourceRequisitionModule, identifier: 'entityPpsEvent'},
			Islinkedfixtoreservation: {location: resourceRequisitionModule, identifier: 'entityIsLinkedFixToReservation'},
			ReservedFrom: { location: resourceRequisitionModule, identifier: 'entityReservedFrom'},
			ReservedTo: { location: resourceRequisitionModule, identifier: 'entityReservedTo'},
			MaterialFk: {location: basicsMaterialModule, identifier: 'record.material'},
			ReservationId: {location: resourceRequisitionModule, identifier: 'ReservationId'},
			ClerkownerFk: { location: resourceRequisitionModule, identifier: 'ClerkownerFk'},
			ClerkresponsibleFk: { location: resourceRequisitionModule, identifier: 'ClerkresponsibleFk'},
			SiteFk: { location: resourceRequisitionModule, identifier: 'entityJobSite'},
			StockFk: { location : resourceRequisitionModule,identifier : 'entityProjectStockFk' },
			RequisitiongroupFk: { location: basicsCustomizeModule, identifier: 'resourcerequisitiongroup',initial:'Resource Requisition Group'},
			RequisitionpriorityFk: {location: basicsCustomizeModule, identifier: 'resrequisitionpriorty', initial:'Resource Requisition Priority'},
			RequisitionTypeFk: { location: basicsCustomizeModule, identifier: 'resrequisitiontype'},
			ParentRequisitionFk: { location: logisticDispatchingModule, identifier: 'parentRequisition' },
			JobpreferredFk: { location : resourceRequisitionModule, identifier : 'entityJobPreferred' },
			ItemMaterialFk: { location: logisticDispatchingModule, identifier: 'itemMaterialFk' },
			ItemDescription: { location: logisticDispatchingModule, identifier: 'itemDescription' },
			ItemReservationId: { location: logisticDispatchingModule, identifier: 'itemReservationId' },
			ItemStockFk: { location: logisticDispatchingModule, identifier: 'itemStockFk' },
			ItemQuantity: { location: logisticDispatchingModule, identifier: 'itemQuantity' },
			ItemUomFk: { location: logisticDispatchingModule, identifier: 'itemUomFk' },
			requisition: {location: logisticDispatchingModule, identifier: 'requisition'},
			requisitionItem: {location: logisticDispatchingModule, identifier: 'requisitionItem'},
			ResourceFk: { location: logisticDispatchingModule, identifier: 'entityResource'},
			LotReceiving: { location: logisticDispatchingModule, identifier: 'entityLotReceiving'},
			ExpirationDate: { location: logisticDispatchingModule, identifier: 'entityExpirationDate'},
			ExpirationDateReceiving: { location: logisticDispatchingModule, identifier: 'entityExpirationDateRecv'},
			MaterialCode: { location: logisticDispatchingModule, identifier: 'entityMaterialCode'},
			MaterialDescription: { location: logisticDispatchingModule, identifier: 'entityMaterialDescription'},
			QuantityDelivered: { location: logisticDispatchingModule, identifier: 'entityQuantityDelivered'},
			Difference: { location: logisticDispatchingModule, identifier: 'entityDifference'},
			RequisitionStatusFk: { location: basicsCustomizeModule, identifier: 'resrequisitionstatus'},
			PrecalculatedWorkOperationTypeFk: { location: logisticDispatchingModule, identifier: 'entityPrecalculatedWorkOperationTypeFk'},
			PricePortionPre01: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPre01'},
			PricePortionPre02: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPre02'},
			PricePortionPre03: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPre03'},
			PricePortionPre04: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPre04'},
			PricePortionPre05: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPre05'},
			PricePortionPre06: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPre06'},
			PricePortionPreOc01: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPreOc01'},
			PricePortionPreOc02: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPreOc02'},
			PricePortionPreOc03: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPreOc03'},
			PricePortionPreOc04: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPreOc04'},
			PricePortionPreOc05: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPreOc05'},
			PricePortionPreOc06: {location:  logisticDispatchingModule, identifier: 'entityPricePortionPreOc06'},
			PriceTotalPreOc: {location:  logisticDispatchingModule, identifier: 'entityPriceTotalPreOc'},
			PricePreOc: {location:  logisticDispatchingModule, identifier: 'entityPricePreOc'},
			PricePre: {location:  logisticDispatchingModule, identifier: 'entityPricePre'},
			PriceTotalPre: {location:  logisticDispatchingModule, identifier: 'entityPriceTotalPre'},
			PlantStatusFk: { location: resourceCommonModule, identifier: 'entityPlantStatus' },
			Action: { location: logisticDispatchingModule, identifier: 'entityAction' },
			ClerkRequesterFk: { location: logisticDispatchingModule, identifier: 'entityClerkRequester' },
			ClerkReceiverFk: { location: logisticDispatchingModule, identifier: 'entityClerkReceiver' },
			LoadingCosts: { location: logisticDispatchingModule, identifier: 'entityLoadingCosts' },
			StockReceivingTransactionTypeFk: { location: logisticDispatchingModule, identifier: 'stockReceivingTransactionType' },
			ProjectChangeFk: {location: cloudCommonModule, identifier: 'entityProjectChange'},
			ProjectChangeStatusFk: { location: basicsCustomizeModule, identifier: 'projectchangestatus', initial: 'Project Change Status' },
			DispatchHeaderFk: { location: logisticDispatchingModule, identifier: 'entityDispatchHeaderFk' },
			SettlementNo: { location: logisticDispatchingModule, identifier: 'entitySettlementNo' },
			SettlementDate: { location: logisticDispatchingModule, identifier: 'entitySettlementDate' },
			Description: { location: logisticDispatchingModule, identifier: 'entityDescription' },
			Insertedat: { location: logisticDispatchingModule, identifier: 'entityInsertedat' },
			Updatedby: { location: logisticDispatchingModule, identifier: 'entityUpdatedby' },
			Updatedat: { location: logisticDispatchingModule, identifier: 'entityUpdatedat' },
			Insertedby: { location: logisticDispatchingModule, identifier: 'entityInsertedby' },
			StatusDescriptionInfo: { location: cloudCommonModule, identifier: 'entityStatus' },
			Volume: { location: logisticDispatchingModule, identifier: 'entityVolume' },
			TransportWeight: { location: logisticDispatchingModule, identifier: 'entityTransportweight' },
			TransportLength: { location: logisticDispatchingModule, identifier: 'entityTransportlength' },
			TransportHeight: { location: logisticDispatchingModule, identifier: 'entityTransportheight' },
			TransportWidth: { location: logisticDispatchingModule, identifier: 'entityTransportwidth' },
			HeaderCode: { location: logisticDispatchingModule, identifier: 'headerCode' },
			HeaderDescription: { location: logisticDispatchingModule, identifier: 'headerDescription' },
			ArticleCode: {location: logisticDispatchingModule, identifier: 'entityArticleCode'},
			ArticleDescription: {location: logisticDispatchingModule, identifier: 'entityArticleDesc'},
			UomWeightFk: { location: basicsCustomizeModule, identifier: 'uomWeight', initial: 'Uom Weight' },
			UomVolumeFk: { location: basicsCustomizeModule, identifier: 'uomVolume', initial: 'Uom Volume' },
			TransportStart: { location: basicsCustomizeModule, identifier: 'transportStart', initial: 'Transport Start' },
			TransportEnd: { location: basicsCustomizeModule, identifier: 'transportEnd', initial: 'Transport End' },
			MaterialCatalogFk: { location: cloudCommonModule, identifier: 'entityMaterialCatalog' },
			UomRecordFk: { location: cloudCommonModule, identifier: 'entityUoM' },
			TotalWeight: {location: logisticDispatchingModule, identifier: 'entityTotalWeight'},
			TransportVolume: { location: logisticDispatchingModule, identifier: 'entityTransportVolume' },
			PricingGroupFk: { location: basicsCustomizeModule, identifier: 'equipmentpricinggroup'},
			MaterialConversion: { location: logisticDispatchingModule, identifier: 'materialConversion'},
			PickingDate: { location: logisticDispatchingModule, identifier: 'pickingDate'},
			LoadingDate: { location: logisticDispatchingModule, identifier: 'loadingDate'},
			DeliveryDate: { location: logisticDispatchingModule, identifier: 'deliveryDate'},
			TruckPlate: { location: logisticDispatchingModule, identifier: 'truckPlate'},
			pickingData: { location: logisticDispatchingModule, identifier: 'pickingData' },
			ClerkPickerTeamleadFk: { location: logisticDispatchingModule, identifier: 'clerkPickerTeamlead'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addProjectStockWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'ItemUserdefinedtext', '0');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefinedtext', '0');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 6, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedIntegerTranslation(data.words, 5, 'UserDefinedInt', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addRequisitionAndReservationWords(data.words);

		let modules = ['logistic', 'resource',  'basics', 'project', 'documents'];
		data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

		// Convert word list into a format used by platform translation service
		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);
