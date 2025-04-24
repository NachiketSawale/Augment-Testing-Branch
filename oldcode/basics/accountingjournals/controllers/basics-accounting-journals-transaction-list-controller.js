/**
 * Created by jhe on 11/21/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).controller('basicsAccountingJournalsTransactionListController',
		['$scope', '$translate', 'platformGridControllerService', 'basicsAccountingJournalsTransactionService', 'basicsAccountingJournalsTransactionUIStandardService',
			'basicsAccountingJournalsTransactionValidationService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns, basicsAccountingJournalsTransactionValidationService) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, basicsAccountingJournalsTransactionValidationService, gridConfig);

			}]
	);
})(angular);