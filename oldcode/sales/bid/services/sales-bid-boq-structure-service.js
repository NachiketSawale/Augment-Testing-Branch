/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesBidBoqStructureService', ['boqMainServiceFactory', 'salesBidService', 'salesBidBoqService', 'salesCommonBoqStructureServiceDecorator', function (boqMainServiceFactory, salesBidService, salesBidBoqService, salesCommonBoqStructureServiceDecorator) {

		var option = {
			maintainHeaderInfo: false,
			parent: salesBidService,
			moduleContext: {
				moduleName: moduleName
			},
			serviceName: 'salesBidBoqStructureService',
			filterByViewer: true
		};
		var serviceContainer = boqMainServiceFactory.createNewBoqMainService(option);
		var service = serviceContainer.service;

		// Enhance sales boq structure service by general functionality placed in the decorator
		salesCommonBoqStructureServiceDecorator.decorate(serviceContainer, salesBidService, salesBidBoqService);

		return service;
	}]);
})();
