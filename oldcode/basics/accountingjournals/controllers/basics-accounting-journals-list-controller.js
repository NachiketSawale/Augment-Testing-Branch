/**
 * Created by jhe on 11/16/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).controller('basicsAccountingJournalsListController',
		['$scope', '$translate', 'platformGridControllerService', 'basicsAccountingJournalsMainService', 'basicsAccountingJournalsUIStandardService',
			'basicsAccountingJournalsValidationService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns, basicsAccountingJournalsValidationService) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, basicsAccountingJournalsValidationService, gridConfig);

				dataService.registerFilters();

				$scope.$on('$destroy', function () {
					dataService.unRegisterFilters();
				});

			}]
	);
})(angular);