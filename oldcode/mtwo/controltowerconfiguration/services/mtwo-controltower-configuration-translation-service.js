/**
 * Created by lal on 2018-06-21.
 */

(function (angular) {
	'use strict';

	var moduleName = 'mtwo.controltowerconfiguration';
	var ControlTowerConfigurationModul = angular.module(moduleName);
	var cloudCommonModule = 'cloud.common';

	/**
	 * @gndoc service
	 * @name mtwoControlTowerTranslationService
	 * @description provides translation for mtwo ControlTower module
	 */
	ControlTowerConfigurationModul.factory('mtwoControlTowerConfigurationTranslationService', ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
		var service = {};
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, cloudCommonModule]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			PowerBISettings: {location: moduleName, identifier: 'PowerBISettings', initial: 'PowerBI Settings'},
			// Id: { location: moduleName, identifier: 'Id', initial: 'Id' },
			Code: {location: moduleName, identifier: 'Code', initial: 'Code'},
			Description: {location: moduleName, identifier: 'Description', initial: 'Description'},
			Logonname: {location: moduleName, identifier: 'Logonname', initial: 'Account Name'},
			Password: {location: moduleName, identifier: 'Password', initial: 'Password'},
			Clientid: {location: moduleName, identifier: 'Clientid', initial: 'ClientId'},
			Resourceurl: {location: moduleName, identifier: 'Resourceurl', initial: 'Resource Url'},
			Authurl: {location: moduleName, identifier: 'Authurl', initial: 'Authorization Url'},
			Apiurl: {location: moduleName, identifier: 'Apiurl', initial: 'Api Url'},
			Accesslevel: {location: moduleName, identifier: 'Accesslevel', initial: 'Access Level'},

			Name: {location: moduleName, identifier: 'Name', initial: 'Name'},
			Groupid: {location: moduleName, identifier: 'Groupid', initial: 'GroupId'},
			Itemid: {location: moduleName, identifier: 'ItemId', initial: 'ItemId'},
			Embedurl: {location: moduleName, identifier: 'Embedurl', initial: 'Embed Url'},
			Itemtype: {location: moduleName, identifier: 'Itemtype', initial: 'Item type'},
			Authorized: {location: moduleName, identifier: 'Authorized', initial: 'Authorized'},
			AzureadIntegrated: {location: moduleName, identifier: 'azureadIntegrated', initial: 'Azure AD Integrated'},
			BasCompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
			IsLive: {location: moduleName, identifier: 'IsLive', initial: 'Is Live'}

		};


		// Get some predefined packages of words used in project
		// platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		// platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}]);
})(angular);
