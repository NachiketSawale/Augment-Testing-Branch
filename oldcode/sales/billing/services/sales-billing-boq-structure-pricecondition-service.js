/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';

	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'salesBillingBoqStructureService', 'salesBillingService',
		function (boqMainPriceconditionServiceFactory, salesBillingBoqStructureService, salesBillingService) {

			var option = {
				parentModuleName : moduleName,
				priceConditionType : 'sales.billing.boq.pricecondition',
				headerService : salesBillingService,
				serviceName : 'salesBillingBoqStructurePriceconditionService',
				selectionChangeWaitForAsyncValidation: true
			};

			var service = boqMainPriceconditionServiceFactory.createService(salesBillingBoqStructureService, option);

			return service;
		}]);
})();
