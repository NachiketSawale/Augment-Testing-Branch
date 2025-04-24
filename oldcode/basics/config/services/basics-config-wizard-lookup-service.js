/**
 * Created by sandu on 22.02.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.config';
	angular.module(moduleName).factory('basicsConfigWizardLookupService', basicsConfigWizardLookupService);
	basicsConfigWizardLookupService.$inject = ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'platformTranslateService'];

	function basicsConfigWizardLookupService(platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, platformTranslateService) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigWizardLookupService', {
			valMember: 'Id',
			dispMember: 'Name',
			columns: [
				{
					id: 'Name',
					field: 'Name',
					name: 'Name',
					formatter: 'description',
					width: 300,
					name$tr$: 'basics.config.entityWizardParameterName'
				}
			],
			uuid: '4bdb368ecad3463bbfbfee67af936854'
		});

		var moduleNames = [];
		var lookupObjects = [];

		var wizardLookupDataServiceConfig = {
			httpRead: {route: globals.webApiBaseUrl + 'basics/config/wizard/', endPointRead: 'list'},
			filterParam: 'moduleId',
			listProcessor: [
				{
					processList: function (items) {
						lookupObjects = items;
						_.each(items, function (item) {
							if (item.TranslationKey) {
								var split = item.TranslationKey.split('.', 2);
								moduleNames.push(split[0]+'.'+split[1]);
								item.Name$tr$ = item.TranslationKey;
							}
						});
						return platformTranslateService.registerModule(moduleNames, true).then(function(){
							return platformTranslateService.translateObject(lookupObjects, 'Name');
						});
					}
				}
			]
		};
		return platformLookupDataServiceFactory.createInstance(wizardLookupDataServiceConfig).service;
	}
})(angular);