/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipBoqStructurePriceconditionService',
		['boqMainPriceconditionServiceFactory', 'salesWipBoqStructureService', 'salesWipService',
			function (boqMainPriceconditionServiceFactory, salesWipBoqStructureService, salesWipService) {

				var option = {
					parentModuleName: moduleName,
					priceConditionType: 'sales.wip.boq.pricecondition',
					headerService: salesWipService,
					serviceName: 'salesWipBoqStructurePriceconditionService',
					selectionChangeWaitForAsyncValidation: true
				};

				var service = boqMainPriceconditionServiceFactory.createService(salesWipBoqStructureService, option);

				return service;
			}]);
})();
