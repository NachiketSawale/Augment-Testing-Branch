(function (angular) {
	'use strict';

	var currentModule = 'transportplanning.transport';
	var cloudCommonModule = 'cloud.common';
	var ppsCommonModule = 'productionplanning.common';
	var basicsCompanyModule = 'basics.company';
	var basicsCharacteristicModule = 'basics.characteristic';
	var transportplanningPackageModule = 'transportplanning.package';
	//These module strings need to be added to allUsedModules, because current module will use the relative containers from other module, and these relative containers need these module strings.
	// And when we just open these relative containers in current module at first, the list/detail config(include translations of columns/rows ) of these relative containers will be created.
	var resMasterModule = 'resource.master';
	var resourceModule = 'resource.reservation';
	var bundleModule = 'transportplanning.bundle';
	var resRequisitionModule = 'resource.requisition';
	var basicsCustomizeModule = 'basics.customize';
	var basicsSiteModule = 'basics.site';
	var customizeModule = 'basics.customize';
	var projectCostCodesModule = 'project.costcodes';
	var logisticJobModule = 'logistic.job';
	var trsRequisitionModule = 'transportplanning.requisition';
	var logisticModule = 'logistic.job';
	var documentsProjectModule = 'documents.project';
	var ppsItemModule = 'productionplanning.item';
	var logisticDispatchingModule = 'logistic.dispatching';
	var businesspartnerMainModule = 'businesspartner.main';
	var resEquipmentModule = 'resource.equipment';
	var resEquipmentGroupModule = 'resource.equipmentgroup';
	var basicsClerkModule = 'basics.clerk';
	var basicsCommon = 'basics.common';

	/**
	 * @ngdoc service
	 * @name transportplanningTransportTranslationService
	 * @description provides translation for transportplanning transport module
	 */
	angular.module(currentModule).factory('transportplanningTransportTranslationService', transportplanningTransportTranslationService);

	transportplanningTransportTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function transportplanningTransportTranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, cloudCommonModule, ppsCommonModule, basicsCompanyModule, basicsCharacteristicModule, transportplanningPackageModule,
				resourceModule, bundleModule, resRequisitionModule, basicsCustomizeModule, basicsSiteModule, customizeModule, projectCostCodesModule,
				logisticJobModule, trsRequisitionModule, resMasterModule, documentsProjectModule, ppsItemModule, logisticDispatchingModule, businesspartnerMainModule,
				resEquipmentModule, resEquipmentGroupModule, basicsClerkModule, basicsCommon]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
			TrsRteStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			UomFk: {location: currentModule, identifier: 'entityDistanceUoMFk', initial: '*Distance UoM'},
			BasUomWeightFk: {location: currentModule, identifier: 'entityUoMWeightFk', initial: '*Weight UoM'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
			AddressFk: {location: basicsCompanyModule, identifier: 'entityAddress', initial: 'Address'},
			EventTypeFk: {location: currentModule, identifier: 'entityEventTypeFk', initial: 'Route Type'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProject', initial: '*Project'},
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
			planningInfoGroup: {
				location: ppsCommonModule,
				identifier: 'event.planInformation',
				initial: 'Planning Information'
			},
			Assignment: {location: ppsCommonModule, identifier: 'assignment', initial: '*Assignment'},
			PlannedTime: {location: ppsCommonModule, identifier: 'event.plannedStart', initial: '*Planned Start Time'},
			ActualTime: {location: ppsCommonModule, identifier: 'event.actualStart', initial: '*Actual Start Time'},
			ActualEnd: {location: ppsCommonModule, identifier: 'event.actualFinish', initial: '*Actual Finish Time'},
			Distance: {location: currentModule, identifier: 'entityDistance', initial: 'Distance'},
			TrsPackageFk: {
				location: transportplanningPackageModule,
				identifier: 'entityPackage',
				initial: 'Transport Package'
			},

			LicCostGroup1Fk: {location: customizeModule, identifier: 'licCostGroup1Fk', initial: '*CostGroup 1'},
			LicCostGroup2Fk: {location: customizeModule, identifier: 'licCostGroup2Fk', initial: '*CostGroup 2'},
			LicCostGroup3Fk: {location: customizeModule, identifier: 'licCostGroup3Fk', initial: '*CostGroup 3'},
			LicCostGroup4Fk: {location: customizeModule, identifier: 'licCostGroup4Fk', initial: '*CostGroup 4'},
			LicCostGroup5Fk: {location: customizeModule, identifier: 'licCostGroup5Fk', initial: '*CostGroup 5'},
			PrjCostGroup1Fk: {location: customizeModule, identifier: 'prjCostGroup1Fk', initial: '*PrjCostGroup1'},
			PrjCostGroup2Fk: {location: customizeModule, identifier: 'prjCostGroup2Fk', initial: '*PrjCostGroup2'},
			PrjCostGroup3Fk: {location: customizeModule, identifier: 'prjCostGroup3Fk', initial: '*PrjCostGroup3'},
			PrjCostGroup4Fk: {location: customizeModule, identifier: 'prjCostGroup4Fk', initial: '*PrjCostGroup4'},
			PrjCostGroup5Fk: {location: customizeModule, identifier: 'prjCostGroup5Fk', initial: '*PrjCostGroup5'},
			LgmJobFk: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: '*Logistic Job'},
			PrjLocationFk: {location: ppsCommonModule, identifier: 'prjLocationFk', initial: '*Location'},
			MdcControllingunitFk: {
				location: ppsCommonModule,
				identifier: 'mdcControllingUnitFk',
				initial: '*Controlling Unit'
			},
			SiteFk: {location: trsRequisitionModule, identifier: 'entitySite', initial: '*Handled By'},

			ActualStart: {location: ppsCommonModule, identifier: 'event.actualStart', initial: '* Actual StartDate'},
			ActualFinish: {location: ppsCommonModule, identifier: 'event.actualFinish', initial: '* Actual FinishDate'},

			ActualDistance: {location: currentModule, identifier: 'entityActualDistance', initial: '* Actual Distance'},
			Expenses:{location: currentModule, identifier: 'entityExpenses', initial: '* Expenses'},
			CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: '* Currency'},
			IsDefaultSrc:{location: currentModule, identifier: 'entityIsDefaultSrc', initial: '*Is Default Source'},
			IsDefaultDst:{location: currentModule, identifier: 'entityIsDefaultDst', initial: '*Is Default Destination'},

			routeInfo: {
				location: currentModule,
				identifier: 'routeInfoGroup',
				initial: '* Route Info'
			},
			SumDistance: {location: currentModule, identifier: 'sumDistance', initial: '*Sum Distance'},
			SumActualDistance: {location: currentModule, identifier: 'sumActualDistance', initial: '*Sum Actual Distance'},
			SumExpenses:{location: currentModule, identifier: 'sumExpenses', initial: '*Sum Expenses'},
			SumPackagesWeight :{location: currentModule, identifier: 'sumPackagesWeight', initial: '*Total Packages Weight'},
			SumProductsActualWeight :{location: currentModule, identifier: 'sumProductsActualWeight', initial: '*Total Products Actual Weight'},
			goodsInfo: {
				location: currentModule,
				identifier: 'goodsInfoGroup',
				initial: '* Goods Info'
			},
			SumBundlesInfo :{location: currentModule, identifier: 'sumBundlesInfo', initial: '*Packages\' Bundles Info'},
			BusinessPartnerFk: {
				location: cloudCommonModule,
				identifier: 'businessPartner',
				initial: '*Business Partner'
			},
			DeliveryAddressContactFk: {location: logisticModule, identifier: 'deliveryAddressContact', initial: '*Delivery Address Contact'},
			ContactTelephone: {location: businesspartnerMainModule, identifier: 'telephoneNumber', initial: '*Telephone'},
			ProjectDefFk:{location: currentModule, identifier: 'entityProjectDefFk', initial: '*Default Client Project'},
			JobDefFk:{location: currentModule, identifier: 'entityJobDefFk', initial: '*Default Client Job'},
			DefSrcWaypointJobFk:{location: currentModule, identifier: 'defSrcWaypointJobFk', initial: '*Default Source Waypoint Job'},
			DefDstWaypointJobFk:{location: currentModule, identifier: 'defDstWaypointJobFk', initial: '*Default Destination Waypoint Job'},
			PlannedDelivery: {location: currentModule, identifier: 'plannedDelivery', initial: '*Planned Delivery Time'},
			ActualDelivery: {location: currentModule, identifier: 'actualDelivery', initial: '*Actual Delivery Time'},
			ProjectName:{location: currentModule, identifier: 'projectName', initial: '*Project-Name'},
			ProjectNo:{location: currentModule, identifier: 'projectNo', initial: '*Project-No'},
			DefProjectName:{location: currentModule, identifier: 'defProjectName', initial: '*Default-Project-Name'},
			TruckTypeFk:{location: currentModule, identifier: 'truckTypeFk', initial: '*Truck Type'},
			TruckFk:{location: currentModule, identifier: 'truckFk', initial: '*Truck'},
			ActualTruckTypeFk:{location: currentModule, identifier: 'actualTruckTypeFk', initial: '*Actual Truck Type'},
			DriverFk:{location: currentModule, identifier: 'driverFk', initial: '*Driver'},
			resources:{location: currentModule, identifier: 'resources', initial: '*Resources'},
			IsLive: {location: basicsCustomizeModule, identifier: 'islive', initial: '*Is Live'},
			contactsGroup:{ location: ppsCommonModule, identifier: 'contactsGroup', initial: '*Contacts' },
			timeInfo: {location: currentModule, identifier: 'timeInfo', initial: '*Time Information'},
			ClerkFk: {location: basicsClerkModule, identifier: 'entityClerk', initial: 'Clerk'},
			From: { location: ppsCommonModule, identifier: 'from', initial: '*From'  },
			ClerkRoleFk: {location: basicsCommon, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			ValidFrom: {location: basicsCommon, identifier: 'entityValidFrom', initial: '*Valid From'},
			ValidTo: {location: basicsCommon, identifier: 'entityValidTo', initial: '*Valid To'},
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			Summary:  {location: transportplanningPackageModule, identifier: 'summary', initial: '*Summary'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 9, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		service.setTranslationForCustomColumns = function () {
			var customColumnsService = customColumnsServiceFactory.getService(currentModule);
			customColumnsService.setTranslation(data.words);
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
		};

		service.data = data;
		return service;
	}
})(angular);
