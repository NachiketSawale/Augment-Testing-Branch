
(function () {
	'use strict';

	angular.module('procurement.orderproposals').controller('procurementOrderProposalsGridController',
		['$scope', '$translate', 'platformGridControllerService', 'procurementOrderProposalsDataService', 'procurementOrderProposalsUIStandardService', 'procurementOrderProposalsValidationService',
			function procurementOrderProposalsGridController($scope, $translate, gridControllerService, dataService, gridColumns, validationService) {

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, {
					initCalled: false,
					columns: [],
					options: {
						editable: false,
						readonly: false
					}
				});
			}]);
})(angular);
