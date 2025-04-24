(function (angular) {
	'use strict';

	var basicsSiteModule = 'basics.site';
	var cloudCommonModule = 'cloud.common';
	var customizeModule = 'basics.customize';
	var resourceMasterModule = 'resource.master';
	var procurementCommonModule = 'procurement.common';
	var timekeepingModule = 'timekeeping.shiftmodel';
	var productModule = 'productionplanning.product';

	//This module string need to be added to allUsedModules, for requestedfrom/requestedto columns of uiStandardConfig of PlanningBoard.
	var resRequisitionModule = 'resource.requisition';
	var basicsClerkModule = 'basics.clerk';
	var basicsCommon = 'basics.common';

	/**
     * @ngdoc service
     * @name basicsSiteTranslationService
     * @description provides translation for basics Site module
     */
	angular.module(basicsSiteModule).factory('basicsSiteTranslationService', BasicsSiteTranslationService);

	BasicsSiteTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function BasicsSiteTranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [basicsSiteModule, cloudCommonModule, resRequisitionModule, customizeModule, resourceMasterModule,
				procurementCommonModule, timekeepingModule, productModule]
		};

		data.words = {
			entitySite: {location: basicsSiteModule, identifier: 'entitySite', initial: 'Site'},
			Code: {location: basicsSiteModule, identifier: 'Code', initial: 'Code'},
			Description: {location: basicsSiteModule, identifier: 'Description', initial: 'Description'},
			AddressFk: {location: basicsSiteModule, identifier: 'AddressFk', initial: 'Address'},
			ClerkMgrFk: {location: basicsSiteModule, identifier: 'ClerkMgrFk', initial: 'Manager'},
			ClerkVicemgrFk: {location: basicsSiteModule, identifier: 'ClerkVicemgrFk', initial: 'Vice Manager'},
			ResourceContextFk: {
				location: basicsSiteModule,
				identifier: 'ResourceContextFk',
				initial: 'Resource Context'
			},
			SiteTypeFk: { location: basicsSiteModule, identifier: 'SiteTypeFk', initial: 'Type' },
			IsLive: {location: customizeModule, identifier: 'islive', initial: '*Is Live'},
			Isdisp: {location: basicsSiteModule, identifier: 'Isdisp', initial: 'Is Dispatching'},
			IsStockyard: {location: basicsSiteModule, identifier: 'IsStockyard', initial: '*Is Stockyard'},
			ResourceFk: {location: resourceMasterModule, identifier: 'entityResource', initial: '*Resource'},
			PrjStockFk: {location: procurementCommonModule, identifier: 'entityPrjStock', initial: '*Stock'},
			PrjStockLocationFk: {location: procurementCommonModule, identifier: 'entityPrjStockLocation', initial: '*Stock Location'},
			IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: '*Is Default'},
			CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: '*Comment'},
			BasExternalsourceFk: {location: customizeModule, identifier: 'externalsourcefk', initial: '*External Source'},
			ExtCode: {location: basicsSiteModule, identifier: 'extCode', initial: '*External Code'},
			ExtDescription: {location: basicsSiteModule, identifier: 'extDescription', initial: '*External Description'},
			Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: '*Sorting'},
			TksShiftFk: {location: timekeepingModule, identifier: 'entityShift', initial: '*Shift Model'},
			AccessRightDescriptorFk: { location: customizeModule, identifier: 'accessrightdescriptor', initial: '*Access Right' },
			ProductionRelease: {location: basicsSiteModule, identifier: 'productionRelease', initial: '*Production Release'},
			BasSiteStockFk: {location: basicsSiteModule, identifier: 'stock', initial: '*Stock'},
			IsActualStock: {location: basicsSiteModule, identifier: 'isActualStock', initial: '*Is Actual Stock'},
			IsProductionStock: {location: basicsSiteModule, identifier: 'isProductionStock', initial: '*Is Production Stock'},
			IsComponentMaterialStock: {location: basicsSiteModule, identifier: 'isComponentMaterialStock', initial: '*Is Component Material Stock'},
			trsportConfigGroup: {location: basicsSiteModule, identifier: 'trsportConfigGroup', initial: '*Transport Configuration'},
			ProjectAdmFk: {location: basicsSiteModule, identifier: 'projectAdmFk', initial: '*Administrative Project'},
			LgmJobAdrFk: {location: basicsSiteModule, identifier: 'lgmJobAdrFk', initial: '*Job'},
			LgmJobProdAreaFk: {location: basicsSiteModule, identifier: 'lgmJobProdAreaFk', initial: '*Production Area Job'},
			ClerkFk: {location: basicsClerkModule, identifier: 'entityClerk', initial: 'Clerk'},
			ClerkRoleFk: {location: basicsCommon, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			ValidFrom: {location: basicsCommon, identifier: 'entityValidFrom', initial: '*Valid From'},
			ValidTo: {location: basicsCommon, identifier: 'entityValidTo', initial: '*Valid To'}
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

		return service;
	}
})(angular);
