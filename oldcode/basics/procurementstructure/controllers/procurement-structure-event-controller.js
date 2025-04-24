(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementEventController',
		['$scope', 'platformGridControllerService', 'basicsProcurementEventUIStandardService',
			'basicsProcurementEventService', 'basicsProcurementStructureEventValidationService','$translate',
			function ($scope, gridControllerService, gridColumns, dataService, validation,$translate) {
				var gridConfig = {
					columns: []
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validation, gridConfig);

	            var tools = [
		            {
			            id: 't1002',
			            sort: 1002,
			            caption: $translate.instant('basics.procurementstructure.event.deepCopy'),
			            type: 'item',
			            iconClass: 'tlb-icons ico-copy-paste-deep',
			            disabled:function () {
			            	return false;
			            },
			            fn: function createCopy() {
				            dataService.createCopy();
			            }
		            }
	            ];
	            gridControllerService.addTools(tools);
			}]);
})(angular);