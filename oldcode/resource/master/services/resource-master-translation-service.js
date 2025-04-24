(function (angular) {
	'use strict';

	var resourceMasterModule = 'resource.master';
	var resourceSkillModule = 'resource.skill';
	var cloudCommonModule = 'cloud.common';
	var customizeModule = 'basics.customize';
	var resourceWotModule = 'resource.wot';
	var resourceEquipmentModule = 'resource.equipment';

	/**
	* @ngdoc service
	* @name resourceMasterTranslationService
	* @description provides translation for resource Master module
	*/
	angular.module(resourceMasterModule).factory('resourceMasterTranslationService', ResourceMasterTranslationService);

	ResourceMasterTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceMasterTranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceMasterModule, resourceSkillModule, cloudCommonModule, customizeModule, resourceEquipmentModule, resourceWotModule]
		};

		data.words = {
			master: {location: resourceMasterModule, identifier: 'listMasterTitle'},
			accounting: {location: resourceMasterModule, identifier: 'accounting'},
			configuration: {location: customizeModule, identifier: 'configurationfk'},
			entityResource: { location: resourceMasterModule, identifier: 'entityResource'},
			IsLive:{location:cloudCommonModule, identifier:'entityIsLive'},
			TypeFk: {location: cloudCommonModule, identifier: 'entityType'},
			GroupFk: { location: cloudCommonModule, identifier: 'entityGroup'},
			CompanyFk: { location: cloudCommonModule, identifier: 'entityCompany'},
			SiteFk: { location: resourceMasterModule, identifier: 'SiteFk'},
			CalendarFk: { location: cloudCommonModule, identifier: 'entityCalCalendarFk'},
			CostCodeFk: {location: resourceMasterModule, identifier: 'CostCodeFk'},
			UomBasisFk: {location: resourceMasterModule, identifier: 'UomBasisFk'},
			UomTimeFk: {location: resourceMasterModule, identifier: 'UomTimeFk'},
			Rate: { location: cloudCommonModule, identifier: 'entityRate'},
			CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency'},
			Validfrom: { location: cloudCommonModule, identifier: 'entityValidFrom'},
			Validto: { location: cloudCommonModule, identifier: 'entityValidTo'},
			ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo'},
			Capacity: { location: resourceMasterModule, identifier: 'Capacity'},
			pool: { location: resourceMasterModule, identifier: 'listPoolTitle'},
			ResourceSubFk: {location: resourceMasterModule, identifier: 'ResourceSubFk'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			KindFk: {location: customizeModule, identifier: 'resourcekind'},
			DispatcherGroupFk: { location: customizeModule, identifier: 'logisticsdispatchergroup'},
			basicData: { location: cloudCommonModule, identifier: 'entityProperties'},
			SkillFk: { location: resourceSkillModule, identifier: 'resourceSkillEntity'},
			ResourcePartTypeFk: { location: resourceMasterModule, identifier: 'partType'},
			PartFk: { location: resourceMasterModule, identifier: 'resourcePart'},
			DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription'},
			PartContextFk: { location: resourceMasterModule, identifier: 'resourcePartContext'},
			Price: { location: cloudCommonModule, identifier: 'entityRate'},
			ExternalCode: {location: resourceMasterModule, identifier: 'externalCode'},
			SortCode: {location: resourceMasterModule, identifier: 'entitySortCode'},
			RefreshDate: {location: resourceMasterModule, identifier: 'entityRefreshDate'},
			ProvSkillDocTypeFk: {location: resourceMasterModule, identifier: 'entityProvSkillDocTypeFk'},
			DocumentTypeFk:{ location: cloudCommonModule, identifier: 'entityType'},
			Date: { location: cloudCommonModule, identifier: 'entityDate'},
			Barcode: {location: resourceMasterModule, identifier: 'entityBarcode'},
			OriginFileName: {location: resourceMasterModule, identifier: 'entityOriginFileName'},
			IsMainPart: {location: resourceMasterModule, identifier: 'isMainPart'},
			HeaderCode: {location: resourceMasterModule, identifier: 'entityHeaderCode'},
			HeaderDescription: {location: resourceMasterModule, identifier: 'entityHeaderDescription'},
			ItemFk: {location: resourceMasterModule, identifier: 'entityItemFk'},
			IsHired: { location: customizeModule, identifier: 'isHired', initial: 'Is Hired' },
			BusinessPartnerFk: { location: resourceMasterModule, identifier: 'entityBusinessPartnerFk', initial: 'Business Partner' },
			ClerkFk: { location: resourceMasterModule, identifier: 'entityClerkFk', initial: 'Clerk' },
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');

		// Convert word list into a format used by platform translation service
		let modules = ['logistic','resource','basics','documents' ];
		data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);
