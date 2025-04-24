/**
 * Created by xia on 5/23/2019.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'prcBoqMainService', 'procurementContextService', 'procurementPesHeaderService',
		'procurementPesBoqService',
		function (boqMainPriceconditionServiceFactory, prcBoqMainService, moduleContext, procurementPesHeaderService,
			procurementPesBoqService) {

			var boqMainService = prcBoqMainService.getService(procurementPesBoqService);

			var option = {
				parentModuleName: moduleName,
				priceConditionType: 'procurement.pes.boq.pricecondition',
				headerService: procurementPesHeaderService,
				serviceName: 'procurementPesBoqStructurePriceconditionService',
				selectionChangeWaitForAsyncValidation: true
			};

			return boqMainPriceconditionServiceFactory.createService(boqMainService, option);
		}]);
})();
