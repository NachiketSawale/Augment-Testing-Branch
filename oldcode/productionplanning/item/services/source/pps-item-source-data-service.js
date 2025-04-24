(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);

	itemModule.factory('ppsItemSourceDataService', PpsItemSourceDataService);

	PpsItemSourceDataService.$inject = ['$injector', 'productionplanningItemDataService',
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor'];

	function PpsItemSourceDataService($injector, ppsItemDataService,
									  platformDataServiceFactory, basicsCommonMandatoryProcessor) {

		var serviceInfo = {
			flatLeafItem: {
				module: itemModule,
				serviceName: 'ppsItemSourceDataService',
				entityNameTranslationID: 'productionplanning.item.entityItemSource',
				httpCRUD: {route: globals.webApiBaseUrl + 'productionplanning/item/source/'},
				dataProcessor: [],
				entityRole: {
					leaf: {
						itemName: 'PpsItemSource',
						parentService: ppsItemDataService,
						parentFilter: 'itemFk'
					}
				},
				actions: {
					create: false,
					delete: false,
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		return container.service;
	}
})(angular);