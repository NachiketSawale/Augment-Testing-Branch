/**
 * Created by xia on 5/23/2019.
 */
(function () {
	'use strict';

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('prcPackageBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'prcBoqMainService', 'procurementContextService', 'procurementPackageDataService',
		function (boqMainPriceconditionServiceFactory, prcBoqMainService, moduleContext, procurementPackageDataService) {

			var boqMainService = prcBoqMainService.getService(moduleContext.getMainService());

			var option = {
				parentModuleName : moduleName,
				priceConditionType : 'procurement.package.boq.pricecondition',
				headerService : procurementPackageDataService,
				serviceName : 'prcPackageBoqStructurePriceconditionService',
				selectionChangeWaitForAsyncValidation: true
			};

			return boqMainPriceconditionServiceFactory.createService(boqMainService, option);
		}]);
})();
