(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name changeTotalsViewService
	 * @function
	 *
	 * @description
	 * changeTotalsViewService is the data service
	 */
	var moduleName = 'change.main';
	var changeMainModule = angular.module(moduleName);
	changeMainModule.factory('changeTotalsViewService', ['$injector', 'platformDataServiceFactory', 'changeMainService',

		function ($injector, platformDataServiceFactory, changeMainService) {

			var factoryOptions = {
				flatLeafItem: {
					module: changeMainModule,
					serviceName: 'changeTotalsViewService',
					entityNameTranslationID: 'change.main.entityChangeTotalsView',
					httpRead: { route: globals.webApiBaseUrl + 'change/totalsv/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = changeMainService.getSelected();
							readData.PKey1 = selected.ProjectFk;
						}},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: { itemName:'TotalsV', parentService: changeMainService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;
			return service;

		}]);
})(angular);
