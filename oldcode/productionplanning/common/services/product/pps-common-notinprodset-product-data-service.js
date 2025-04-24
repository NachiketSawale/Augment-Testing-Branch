(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name ppsCommonItemNotInProdsetProductDataService
	 * @function
	 *
	 * @description
	 * ppsItemNotInProdsetProductDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.common';
	var masterModule = angular.module(moduleName);

	masterModule.factory('ppsCommonItemNotInProdsetProductDataService', DataService);

	DataService.$inject = ['_', '$injector', '$http',
		'productionplanningCommonProductDataServiceFactory',
		'productionplanningItemDataService'];

	function DataService(_, $injector, $http,
		productionplanningCommonProductDataServiceFactory,
		itemDataService) {
		var serviceOption = {
			flatNodeItem: {
				serviceName: 'ppsCommonItemNotInProdsetProductDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'listnotinprodsetproductsbyitem',
					initReadData: function initReadData(readData) {
						readData.filter = '?itemFk=' + _.get(itemDataService.getSelected(), 'Id');
					}
				},
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: itemDataService,
						parentFilter: 'itemFk'
					}
				},
				actions: {},
			},
			isNotRoot: true
		};

		/* jshint -W003 */
		var serviceContainer = productionplanningCommonProductDataServiceFactory.createService(serviceOption);

		return serviceContainer.service;
	}
})(angular);

