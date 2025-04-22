/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingBoqStructureService', [
		'_', 'boqMainServiceFactory', 'salesBillingService', 'salesBillingBoqService', 'salesCommonBoqStructureServiceDecorator',
		function (_, boqMainServiceFactory, salesBillingService, salesBillingBoqService, salesCommonBoqStructureServiceDecorator) {

			var service = {};
			var option = {
				maintainHeaderInfo: false,
				parent: salesBillingService,
				moduleContext: {
					moduleName: moduleName
				},
				serviceName: 'salesBillingBoqStructureService',
				filterByViewer: true
			};

			var serviceContainer = boqMainServiceFactory.createNewBoqMainService(option);
			service = serviceContainer.service;

			// Enhance sales boq structure service by general functionality placed in the decorator
			salesCommonBoqStructureServiceDecorator.decorate(serviceContainer, salesBillingService, salesBillingBoqService, false, true);

			return service;
		}]);
})();
