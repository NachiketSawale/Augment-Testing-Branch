/**
 * Created by sandu on 21.04.2022.
 */

(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = new angular.module(moduleName);

	configModule.factory('basicsConfigBarItemsLookupService', basicsConfigBarItemsLookupService);

	basicsConfigBarItemsLookupService.$inject = ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator','platformTranslateService'];

	function basicsConfigBarItemsLookupService(platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, platformTranslateService) {
		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsConfigBarItemsLookupService', {
			valMember: 'Id',
			dispMember: 'Name',
			columns: [
				{
					id: 'Name',
					field: 'Name',
					name: 'Name',
					formatter: 'description',
					name$tr$: 'basics.config.entityName',
				}
			],
			uuid: '38bc5c95272949fc8c0beb27b1e1cf56'
		});

		var moduleNames = [];
		var lookupObjects = [];

		var barItemsLookupDataServiceConfig = {
			httpRead: { route: globals.webApiBaseUrl + 'basics/config/baritem/', endPointRead:'lookup', usePostForRead:false},
			listProcessor: [
				{
					processList: function (items) {
						lookupObjects = items;
						_.each(items, function (item) {
							if (item.Translationkey) {
								var split = item.Translationkey.split('.', 2);
								moduleNames.push(split[0]+'.'+split[1]);
								item.Name$tr$ = item.Translationkey;
							}
						});
						return platformTranslateService.registerModule(moduleNames, true).then(function(){
							return platformTranslateService.translateObject(lookupObjects, 'Name');
						});
					}
				}
			]
		};

		return platformLookupDataServiceFactory.createInstance(barItemsLookupDataServiceConfig).service;
	}

})(angular);