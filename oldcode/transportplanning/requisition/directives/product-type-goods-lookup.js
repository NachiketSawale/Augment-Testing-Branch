(angular => {
	'use strict';
	const moduleName = 'transportplanning.requisition';
	angular.module(moduleName).directive('productTypeGoodsLookup', productTypeGoodsLookup);

	productTypeGoodsLookup.$inject = ['$injector', 'LookupFilterDialogDefinition', 'productionPlanningCommonProductLookupNewService', 'trsGoodsTypes'];

	function productTypeGoodsLookup($injector, LookupFilterDialogDefinition, productionPlanningCommonProductLookupNewService) {
		const lookupOptions = angular.copy(productionPlanningCommonProductLookupNewService.getLookupOptions());

		const originFn = lookupOptions.filterOptions.fn;
		lookupOptions.filterOptions.fn = item => {
			const params = originFn(item);

			if (params.ProjectId > 0) { // already set
				return params;
			}

			setAdditionalParameters(params, getTrsReq(item));

			return params;
		};

		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningCommonProductLookupNewDataService', lookupOptions.detailConfig, lookupOptions.gridSettings);

		function getTrsReq(item) {
			if (!item.TrsReqEntity) {
				item.TrsReqEntity = $injector.get('transportplanningRequisitionMainService').getSelected();
			}
			return item.TrsReqEntity;
		}

		function setAdditionalParameters(params, req) {
			params.ProjectId = req.ProjectFk;
			params.JobId = req.LgmJobFk;
			params.Status = [];
			params.notAssignedToPkg = true;
			params.notAssignedToReq = true;
			params.notShipped = true;
		}
	}
})(angular);