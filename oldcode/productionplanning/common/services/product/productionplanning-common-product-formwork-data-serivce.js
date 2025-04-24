(function (angular) {
	'use strict';
	/* global angular, globals */
	/**
	 * @ngdoc service
	 * @name productionplanningCommonProductFormworkDataService
	 * @function
	 *
	 * @description
	 * productionplanningCommonProductFormworkDataService is the data service for all entities related functionality.
	 */
	const moduleName = 'productionplanning.common';
	let masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningCommonProductFormworkDataService', ProductionplanningCommonProductFormworkDataService);

	ProductionplanningCommonProductFormworkDataService.$inject = ['_', '$injector', '$http',
		'productionplanningCommonProductDataServiceFactory',
		'ppsFormworkDataService',
		'basicsCommonMandatoryProcessor',
		'productionplanningCommonProductValidationFactory'];

	function ProductionplanningCommonProductFormworkDataService(_, $injector, $http,
		productionplanningCommonProductDataServiceFactory,
		ppsFormworkDataService,
		basicsCommonMandatoryProcessor,
		validationServiceFactory) {
		let serviceOption = {
			flatNodeItem: {
				serviceName: 'productionplanningCommonProductFormworkDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'customlistbyforeignkey',
					initReadData: function initReadData(readData) {
						let mainItemId = ppsFormworkDataService.getSelected().ProcessFk || -1;
						readData.filter = `?foreignKey=PpsProcessFk&mainItemId=${mainItemId}`;
					}
				},
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: ppsFormworkDataService,
						parentFilter: 'processFk'
					}
				},
				actions: {
					delete: false,
					create: {}
				}
			},
			isNotRoot: true
		};

		/* jshint -W003 */
		let serviceContainer = productionplanningCommonProductDataServiceFactory.createService(serviceOption);

		serviceContainer.data.newEntityValidator = validationServiceFactory.getNewEntityValidator(serviceContainer.service);

		return serviceContainer.service;
	}
})(angular);

