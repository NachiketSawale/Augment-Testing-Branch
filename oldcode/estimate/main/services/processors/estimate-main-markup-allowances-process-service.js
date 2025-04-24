
(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainStandardMarkupAllowanceProcessor',
		['$q', '$injector', 'platformRuntimeDataService',
			function ($q, $injector, platformRuntimeDataService) {

				let service = {
					processItem : processItem,
				};

				function processItem(item) {
					if(!item || item.Id < 0){
						return;
					}

					let isHeaderReadOnly = $injector.get('estimateMainStandardAllowancesDataService').getIsReadOnlyContainer();

					let fields = [
						{field: 'MdcCostCodeFk', readonly: true},
						{field: 'GaPerc', readonly: isHeaderReadOnly},
						{field: 'RpPerc', readonly: isHeaderReadOnly},
						{field: 'AmPerc', readonly: isHeaderReadOnly},
						{field: 'DefMGraPerc', readonly: isHeaderReadOnly},
						{field: 'DefMPerc', readonly: isHeaderReadOnly},
						{field: 'DefMGcPerc', readonly: isHeaderReadOnly},
						{field: 'DefMOp', readonly: isHeaderReadOnly}
					];

					platformRuntimeDataService.readonly(item, fields);
				}


				return service;
			}]);
})(angular);
