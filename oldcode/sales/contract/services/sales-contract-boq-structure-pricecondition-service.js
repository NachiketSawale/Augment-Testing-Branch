/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'salesContractBoqStructureService', 'salesContractService',
		function (boqMainPriceconditionServiceFactory, salesContractBoqStructureService, salesContractService) {

			var option = {
				parentModuleName: moduleName,
				priceConditionType: 'sales.contract.boq.pricecondition',
				headerService: salesContractService,
				serviceName: 'salesContractBoqStructurePriceconditionService',
				selectionChangeWaitForAsyncValidation: true
			};

			var service = boqMainPriceconditionServiceFactory.createService(salesContractBoqStructureService, option);

			return service;
		}]);
})();
