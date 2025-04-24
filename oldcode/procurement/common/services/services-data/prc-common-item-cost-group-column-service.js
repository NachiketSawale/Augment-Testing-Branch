(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonPrcItemCostGroupColumnsService',
		['procurementContextService', 'procurementCommonPrcItemDataService', 'basicsCostGroupAssignmentService',
			function (moduleContext, dataServiceFactory, basicsCostGroupAssignmentService) {

				var mainService = moduleContext.getMainService();
				var dataService = dataServiceFactory.getService(mainService);

				var costgroupColumns = null;

				return {
					getPrcItemCostGroupColumns: function () {
						if (dataService.costGroupCatalogs) {
							costgroupColumns = basicsCostGroupAssignmentService.createCostGroupColumns(dataService.costGroupCatalogs);
						}
						return costgroupColumns;
					}
				};
			}]);
})(angular);

