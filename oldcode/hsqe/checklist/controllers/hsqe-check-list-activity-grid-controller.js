/**
 * Created by alm on 1/25/2021.
 */
(function (angular) {
	'use strict';

	angular.module('hsqe.checklist').controller('hsqeCheckListActivityGridController',
		['$scope', 'globals', '$injector','platformGridControllerService', 'hsqeCheckListActivityUIStandardService', 'hsqeCheckListActivityDataService','hsqeCheckListActivityValidationService',
			function ($scope, globals,$injector, gridControllerService, gridColumns, dataService,validationService) {
				$scope.path = globals.appBaseUrl;
				gridControllerService.initListController($scope, gridColumns, dataService,validationService, {});
			}
		]);
})(angular);
