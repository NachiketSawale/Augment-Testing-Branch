(function (angular) {
	/* global angular */
	'use strict';
	/**
	 * @ngdoc service
	 * @name bundleTranslationService
	 * @function
	 *
	 * @description
	 * bundleTranslationService is the data service for all Production Set related functionality.
	 * */
	var cloudCommonModule = 'cloud.common';
	var projectMainModule = 'project.main';
	var basicsSiteModule = 'basics.site';
	var trsPackageModule = 'transportplanning.package';
	var trsRequisitionModule = 'transportplanning.requisition';
	var transportModule = 'transportplanning.transport';
	var resTypeModule = 'resource.type';
	var ppsCommonModule = 'productionplanning.common';
	var ppsProductModule = 'productionplanning.product'; // for "book products to stock location" wizard
	var logisticJobModule = 'logistic.job';//for translation of job lookup
	var drawingModule = 'productionplanning.drawing';//for translation of drawing lookup
	var projectCostCodesModule = 'project.costcodes';
	var basicsCustomizeModule = 'basics.customize';//for translation of fields(e.g. licCostGroup1Fk) of PpsEvent container
	var resMasterModule = 'resource.master';//for translation of fields(e.g. ResourceFk) of Loading Device ResReservations container
	var resReservationModule = 'resource.reservation';//for translation of fields(e.g. ReservedFrom) of Loading Device ResReservations container
	var ppsItemModule = 'productionplanning.item';
	var procurementCommonModule = 'procurement.common';


	var moduleName = 'transportplanning.bundle';
	var bundleModul = angular.module(moduleName);

	bundleModul.factory('transportplanningBundleTranslationService', BundleTranslationService);
	BundleTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function BundleTranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				moduleName, cloudCommonModule, projectMainModule,
				basicsSiteModule, trsPackageModule, trsRequisitionModule, transportModule,
				resMasterModule, resReservationModule, resTypeModule, ppsCommonModule, ppsProductModule, logisticJobModule, projectCostCodesModule,basicsCustomizeModule, drawingModule]
		};

		data.words = {
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
			TrsBundleTypeFk: {location: moduleName, identifier: 'entityBundleType', initial: '*Bundle Type'},
			TrsBundleStatusFk: {location: moduleName, identifier: 'entityBundleStatus', initial: '*Bundle Status'},
			LgmJobFk: {location: moduleName, identifier: 'entityJob', initial: '*Logistic Job'},
			SiteFk: {location: basicsSiteModule, identifier: 'entitySite', initial: 'Site'},
			TrsPackageFk: {location: trsPackageModule, identifier: 'entityPackage', initial: 'Package'},
			Length: {location: moduleName, identifier: 'length', initial: 'Length'},
			BasUomLengthFk: {location: moduleName, identifier: 'lengthUom', initial: '*Length Uom'},
			Width: {location: moduleName, identifier: 'width', initial: 'Width'},
			BasUomWidthFk: {location: moduleName, identifier: 'widthUom', initial: '*Width Uom'},
			Height: {location: moduleName, identifier: 'height', initial: 'Height'},
			BasUomHeightFk: {location: moduleName, identifier: 'heightUom', initial: '*Height Uom'},
			Weight: {location: moduleName, identifier: 'weight', initial: 'Weight'},
			BasUomWeightFk: {location: moduleName, identifier: 'weightUom', initial: '*Weight Uom'},
			IsLive: {location: moduleName, identifier: 'entityIsLive', initial: 'Is Live'},
			transport: {location: moduleName, identifier: 'transport', initial: 'Transport'},
			dimensions: {location: moduleName, identifier: 'dimensions', initial: 'Dimensions'},
			products: {location: moduleName, identifier: 'products', initial: 'Products'},
			loadingDevice: {
				location: moduleName,
				identifier: 'loadingDevice',
				initial: 'Loading Device'
			},
			TrsRequisitionFk: {
				location: trsRequisitionModule,
				identifier: 'entityRequisition',
				initial: 'Transport Requisition'
			},
			TrsRequisitionDate: {location: trsRequisitionModule, identifier: 'entityRequisitionDate', initial: '*TrsRequisition Date'},
			DrawingFkOfStack: {location: moduleName, identifier: 'drawingFkOfStack', initial: '*Drawing of Stack'},
			ProductionOrder:{ location: ppsCommonModule, identifier: 'product.productionOrder', initial: '*Production Order'},
			Reproduced: { location: ppsCommonModule, identifier: 'product.reproduced', initial: '*Reproduced'},
			EngDrawingFk: { location: ppsCommonModule, identifier: 'product.drawing', initial: '*Drawing' },
			PPSItemFk: {location: ppsCommonModule, identifier: 'event.itemFk', initial: '*Production Unit'},
			PpsUpstreamStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			PpsUpstreamTypeFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsUpstreamTypeFk', initial: '*Upstream Type'},
			UpstreamResult: {location: ppsItemModule, identifier: 'upstreamItem.upstreamresult', initial: '*Upstream Result'},
			UpstreamResultStatus: {location: ppsItemModule, identifier: 'upstreamItem.upstreamresultstatus', initial: '*Status Upstream'},
			UpstreamGoods: {location: ppsItemModule, identifier: 'upstreamItem.upstreamgoods', initial: '*Upstream Good'},
			PpsUpstreamGoodsTypeFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsupstreamgoodstype', initial: '*Upstream Goods Type'},
			IsForTransport: { location: ppsItemModule, identifier: 'upstreamItem.isForTransport', initial: '*For Transport' },
			CurrentLocationJobFk: {location: moduleName, identifier: 'entityJobFromHistory', initial: '*Current Location Job'},
			TimeStamp: { location: ppsCommonModule, identifier: 'product.timeStamp', initial: '*Time Stamp'},
			StatusId: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			PpsEventtypeReqforFk: {location: ppsItemModule, identifier: 'upstreamItem.ppsEventtypeReqforFk', initial: 'Required For Type'},
			PpsEventReqforFk: {location: ppsItemModule, identifier: 'upstreamItem.ppseventreqfor', initial: '*Required For'},
			PpsHeaderFk: {location: ppsItemModule, identifier: 'headerFk', initial: '*Header'},
			TargetJobFk: {location: moduleName, identifier: 'entityTargetJob', initial: '*Target Job'},
			UomFk: {location: ppsItemModule, identifier: 'uomFk', initial: '*UOM'},
			TrsOpenQuantity:{location: ppsItemModule, identifier: 'upstreamItem.TrsOpenQuantity', initial: '*Transport Open Quantity'},
			TrsAssignedQuantity:{location: ppsItemModule, identifier: 'upstreamItem.TrsAssignedQuantity', initial: '*Transport Assigned Quantity'},
			SplitQuantity: {location: ppsItemModule, identifier: 'upstreamItem.splitQuantity', initial: '*Split Quantity'},
			RemainingQuantity: {location: ppsItemModule, identifier: 'upstreamItem.remainingQuantity', initial: '*Remaining Quantity'},
			OpenQuantity:  {location: ppsItemModule, identifier: 'upstreamItem.openQuantity', initial: '*Open Quantity'},
			AssignedQuantity: { location: ppsItemModule, identifier: 'assignedQuantity', initial: '*Assigned Quantity' },
			AvailableQuantity:  {location: ppsItemModule, identifier: 'upstreamItem.availableQuantity', initial: '*Available Quantity'},
			PrjStockFk: {location: procurementCommonModule, identifier: 'entityPrjStock', initial: '*Stock'},
			PrjStockLocationFk: {location: procurementCommonModule, identifier: 'entityPrjStockLocation', initial: '*Stock Location'},
			MaterialFk: { location: ppsCommonModule, identifier: 'product.material', initial: '*Material'},
		};

		var customColumnsService = customColumnsServiceFactory.getService(moduleName);
		customColumnsService.setTranslation(data.words);

		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);