(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name changeTotalsGroupedViewService
	 * @function
	 *
	 * @description
	 * changeTotalsGroupedViewService is the data service
	 */
	var moduleName = 'change.main';
	var changeMainModule = angular.module(moduleName);
	changeMainModule.factory('changeTotalsGroupedViewService', ['$injector', 'platformDataServiceFactory', 'changeMainService',

		function ($injector, platformDataServiceFactory, changeMainService) {

			var factoryOptions = {
				flatLeafItem: {
					module: changeMainModule,
					serviceName: 'changeTotalsGroupedViewService',
					entityNameTranslationID: 'change.main.entityChangeTotalsGroupedView',
					httpRead: { route: globals.webApiBaseUrl + 'change/totalsgroupedv/',
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
