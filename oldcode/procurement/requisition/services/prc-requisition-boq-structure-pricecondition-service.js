/**
 * Created by xia on 5/23/2019.
 */
(function(){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.requisition';

	angular.module(moduleName).factory('prcRequisitionBoqStructurePriceconditionService', ['boqMainPriceconditionServiceFactory', 'prcBoqMainService', 'procurementContextService', 'procurementRequisitionHeaderDataService',
		function(boqMainPriceconditionServiceFactory, prcBoqMainService, moduleContext, procurementRequisitionHeaderDataService){

			var boqMainService = prcBoqMainService.getService(moduleContext.getMainService());

			var context = null;
			var leadingService = moduleContext.getLeadingService();
			if (leadingService && angular.isFunction(leadingService.isReadonlyWholeModule)){
				context = {};
				context.isModuleReadOnly = moduleContext.isReadOnly;
				context.isReadonlyWholeModule = leadingService.isReadonlyWholeModule;
			}

			var option = {
				parentModuleName : moduleName,
				priceConditionType : 'procurement.requisition.boq.pricecondition',
				headerService : procurementRequisitionHeaderDataService,
				serviceName : 'prcRequisitionBoqStructurePriceconditionService',
				context : context,
				selectionChangeWaitForAsyncValidation: true,
			};

			return boqMainPriceconditionServiceFactory.createService(boqMainService, option);
		}]);
})();
