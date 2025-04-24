/**
 * Created by xia on 5/23/2019.
 */
(function(){
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.quote';

	angular.module(moduleName).factory('prcQuoteBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'prcBoqMainService', 'procurementContextService', 'procurementQuoteHeaderDataService',
		function(boqMainPriceconditionServiceFactory, prcBoqMainService, moduleContext, procurementQuoteHeaderDataService){

			var boqMainService = prcBoqMainService.getService(moduleContext.getMainService());

			var option = {
				parentModuleName : moduleName,
				priceConditionType : 'procurement.quote.boq.pricecondition',
				headerService : procurementQuoteHeaderDataService,
				serviceName : 'prcQuoteBoqStructurePriceconditionService',
				selectionChangeWaitForAsyncValidation: true
			};

			return boqMainPriceconditionServiceFactory.createService(boqMainService, option);
		}]);
})();
