/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function(){
	'use strict';

	var moduleName = 'sales.bid';

	angular.module(moduleName).factory('salesBidBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'salesBidBoqStructureService', 'salesBidService',
		function(boqMainPriceconditionServiceFactory, salesBidBoqStructureService, salesBidService){

			var option = {
				parentModuleName : moduleName,
				priceConditionType : 'sales.bid.boq.pricecondition',
				headerService : salesBidService,
				serviceName : 'salesBidBoqStructurePriceconditionService',
				selectionChangeWaitForAsyncValidation: true
			};

			var service = boqMainPriceconditionServiceFactory.createService(salesBidBoqStructureService, option);

			return service;
		}]);
})();
