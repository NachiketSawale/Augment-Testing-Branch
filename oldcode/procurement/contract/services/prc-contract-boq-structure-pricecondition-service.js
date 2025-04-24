/**
 * Created by xia on 5/23/2019.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).factory('prcContractBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'prcBoqMainService', 'procurementContextService', 'procurementContractHeaderDataService',
		function (boqMainPriceconditionServiceFactory, prcBoqMainService, moduleContext, procurementContractHeaderDataService) {

			var boqMainService = prcBoqMainService.getService(moduleContext.getMainService());

			var option = {
				parentModuleName: moduleName,
				priceConditionType: 'procurement.contract.boq.pricecondition',
				headerService: procurementContractHeaderDataService,
				serviceName: 'prcContractBoqStructurePriceconditionService',
				selectionChangeWaitForAsyncValidation: true
			};

			return boqMainPriceconditionServiceFactory.createService(boqMainService, option);
		}]);
})();
