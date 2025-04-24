(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name requisitionTranslationService
	 * @function
	 *
	 * @description
	 * requisitionTranslationService is the data service for all Requisition related functionality.
	 * */
	var cloudCommonModule = 'cloud.common';
	var projectMainModule = 'project.main';
	var basicsClerkModule = 'basics.clerk';
	var basicsSiteModule = 'basics.site';
	var basicsCompanyModule = 'basics.company';
	var basicsCommon = 'basics.common';
	var ppsMountingModule = 'productionplanning.mounting';
	var ppsActivityModule = 'productionplanning.activity';//provide translation for additional fields of TrsRequisition Grid Container(e.g. 'productionplanning.activity.entityDesc')
	var basicsMaterialModule = 'basics.material';
	var bundleModule = 'transportplanning.bundle';
	var resourceTypeModule = 'resource.type';
	var resourceReservationModule = 'resource.reservation';
	var trsRoute = 'transportplanning.transport';
	var logisticJobModule = 'logistic.job';
	var ppsCommonModule = 'productionplanning.common';
	var drawingModule = 'productionplanning.drawing';

	//this module string need to be added to allUsedModules, because current module will use these relative containers from Transport Bundle module , and these relative containers need the module string.
	var packageModule = 'transportplanning.package';
	var resMasterModule = 'resource.master';
	var resRequisitionModule = 'resource.requisition';
	var resEquipmentModule = 'resource.equipment';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionTranslationService', RequisitionTranslationService);
	RequisitionTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function RequisitionTranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [
				moduleName, cloudCommonModule, projectMainModule, basicsSiteModule,
				basicsClerkModule, basicsCompanyModule, basicsCommon, ppsMountingModule,ppsActivityModule, basicsMaterialModule, bundleModule, drawingModule,
				packageModule, resourceTypeModule, resMasterModule, resRequisitionModule, resourceReservationModule, trsRoute, logisticJobModule, ppsCommonModule, resEquipmentModule]
		};

		data.words = {
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
			ClerkFk: {location: basicsClerkModule, identifier: 'entityClerk', initial: 'Clerk'},
			BusinessPartnerFk: {
				location: projectMainModule,
				identifier: 'entityBusinessPartner',
				initial: '*BusinessPartner'
			},
			ContactFk: {location: projectMainModule, identifier: 'entityContact', initial: '*Contact'},
			SiteFk: {location: moduleName, identifier: 'entitySite', initial: 'Handled By*'},
			TrsReqStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			//AddressFk: {location: basicsCompanyModule, identifier: 'entityAddress', initial: 'Address'},
			Date: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Date'},
			CommentText: {location: projectMainModule, identifier: 'entityCommentText', initial: 'Comment Text'},
			MntActivityFk: {location: ppsMountingModule, identifier: 'entityActivity', initial: 'Mounting Activity'},
			MdcMaterialFk: {location: basicsMaterialModule, identifier: 'view.materialRecord', initial: 'Material'},
			TrsMrqStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			TrsRequisitionFk: {location: moduleName, identifier: 'entityRequisition', initial: 'Transport Requisition'},
			ResTypeFk: {location: resourceTypeModule, identifier: 'entityResourceType', initial: '*Resource Type'},
			bindings: {location: moduleName, identifier: 'bindings', initial: 'Bindings'},
			statistics: {location: moduleName, identifier: 'detail.statistics.title', initial: 'Statistics'},
			IsLive: {location: moduleName, identifier: 'isLive', initial: 'IsLive'},
			LgmJobFk: {location: logisticJobModule, identifier: 'entityJob', initial: '*Job'},
			UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM' },
			deliveryGroup: {location: packageModule, identifier: 'groupDelivery', initial: 'Delivery'},
			EventTypeFk: {location: moduleName, identifier: 'entityEventTypeFk', initial: '*Requisition Type'},
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: '*Quantity'},
			TrsGoodsTypeFk: {location: moduleName, identifier: 'trsGoods.goodsType', initial: '*Good Type'},
			Good: {location: moduleName, identifier: 'trsGoods.good', initial: '*Good'},
			Length: {location: ppsCommonModule, identifier: 'product.length', initial: '*Length'},
			BasUomLengthFk: {location: ppsCommonModule, identifier: 'product.lengthUoM', initial: '*Length UoM'},
			Width: {location: ppsCommonModule, identifier: 'product.width', initial: '*Width'},
			BasUomWidthFk: {location: ppsCommonModule, identifier: 'product.widthUoM', initial: '*Width UoM'},
			Height: {location: ppsCommonModule, identifier: 'product.height', initial: '*Height'},
			BasUomHeightFk: {location: ppsCommonModule, identifier: 'product.heightUoM', initial: '*Height UoM'},
			Weight: {location: ppsCommonModule, identifier: 'product.weight', initial: '*Weight'},
			BasUomWeightFk: {location: ppsCommonModule, identifier: 'product.weightUoM', initial: '*Weight UoM'},
			dimensions: {location: ppsCommonModule, identifier: 'product.dimensions', initial: '*Dimensions'},
			contactsGroup: {location: ppsCommonModule, identifier: 'contactsGroup', initial: '*Contacts'},
			IsPickup: {location: moduleName, identifier: 'pickup', initial: '*Pickup'},
			transportInformation: {location: moduleName, identifier: 'trsGoods.transportInformation', initial: '*Transport Information'},
			OnTime: {location: moduleName, identifier: 'trsGoods.onTime', initial: '*On Time'},
			PlanningState: {location: moduleName, identifier: 'trsGoods.planningState', initial: '*Planning State'},
			PkgsQuantity: {location: moduleName, identifier: 'trsGoods.pkgsQuantity', initial: '*Planned Quantity'},
			MinPkgsStatus: {location: moduleName, identifier: 'trsGoods.minPkgsStatus', initial: '*Package Min Status'},
			MaxPkgsStatus: {location: moduleName, identifier: 'trsGoods.maxPkgsStatus', initial: '*Package Max Status'},
			MinProductStatus: {location: bundleModule, identifier: 'product.entityProductsStatusMin', initial: '*Products Status Min'},
			MaxProductStatus: {location: bundleModule, identifier: 'product.entityProductsStatusMax', initial: '*Products Status Max'},
			From: { location: ppsCommonModule, identifier: 'from', initial: '*From'  },
			ClerkRoleFk: {location: basicsCommon, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			ValidFrom: {location: basicsCommon, identifier: 'entityValidFrom', initial: '*Valid From'},
			ValidTo: {location: basicsCommon, identifier: 'entityValidTo', initial: '*Valid To'},
			PlannedStart: {location: ppsCommonModule, identifier: 'event.plannedStart', initial: 'Planned StartDate'},
			PlannedFinish: {
				location: ppsCommonModule,
				identifier: 'event.plannedFinish',
				initial: 'Planned FinishDate'
			},
			EarliestStart: {
				location: ppsCommonModule,
				identifier: 'event.earliestStart',
				initial: 'Earliest StartDate'
			},
			LatestStart: {location: ppsCommonModule, identifier: 'event.latestStart', initial: 'Latest StartDate'},
			EarliestFinish: {
				location: ppsCommonModule,
				identifier: 'event.earliestFinish',
				initial: 'Earliest FinishDate'
			},
			LatestFinish: {location: ppsCommonModule, identifier: 'event.latestFinish', initial: 'Latest FinishDate'},
			PlannedTime: {location: moduleName, identifier: 'planTime', initial: '*Planned Time'},
			planningInfoGroup: {
				location: ppsCommonModule,
				identifier: 'event.planInformation',
				initial: 'Planning Information'
			},
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			IsCancelled: {location: moduleName, identifier: 'trsGoods.isCancelled', initial: '*Is Cancelled'},
			productsGroup: {location: bundleModule, identifier: 'products', initial: 'Products'},
			dangerousGoodsGroup: {location: packageModule, identifier: 'dangerousGoods.dangerousGoodsGroup', initial: '*Dangerous Goods'},
			BasDangerclassFk : {location: packageModule, identifier: 'dangerousGoods.dangerClass', initial: '*Danger Class'},
			CurrentLocationJobFk  : {location: logisticJobModule, identifier: 'currentlocationjobfk', initial: 'Current Location'},
			DangerQuantity: {location: packageModule, identifier: 'dangerousGoods.dangerQuantity', initial: '*Danger Quantity'},
			BasUomDGFk: {location: packageModule, identifier: 'dangerousGoods.uomDGFk', initial: '*UoM (Danger Good)'},
			MaxWeight: {location: moduleName, identifier: 'maxWeight', initial: '*Max Weight'},
			Summary:  {location: ppsCommonModule, identifier: 'summary', initial: '*Summary'},
			EngDrawingFk: {location: drawingModule, identifier: 'entityDrawing', initial: 'Drawing'},
			ProductsDescription: {location: moduleName, identifier: 'trsGoods.descriptionsOfProducts', initial: '*Descriptions of Products'},
			ProductTemplateCodes: {location: moduleName, identifier: 'trsGoods.productTemplateCodes', initial: '*Product Template Code(s)'},
			ProductTemplateDescriptions: {location: moduleName, identifier: 'trsGoods.productTemplateDescriptions', initial: '*Product Template Description(s)'},
			MinProductionDate: {location: bundleModule, identifier: 'product.entityMinDeliveryDate', initial: '*Min Production Date'},
			MaxProductionDate: {location: bundleModule, identifier: 'product.entityMaxDeliveryDate', initial: '*Max Production Date'},
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		service.setTranslationForCustomColumns = function () {
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			customColumnsService.setTranslation(data.words);
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
		};

		service.data = data;
		return service;
	}
})(angular);