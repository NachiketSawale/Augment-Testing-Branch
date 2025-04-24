/**
 * Created by alm on 8/25/2020.
 */
(function (angular) {
	'use strict';

	angular.module('basics.taxcode').controller('basicsTaxCodeMatrixListController', ['$scope', 'globals', 'platformGridControllerService', 'basicsTaxCodeMatrixUIStandardService', 'basicsTaxCodeMatrixService', 'basicsTaxCodeMatrixValidationService',
		function ($scope, globals, gridControllerService, gridColumns, dataService, validationService) {
			$scope.path = globals.appBaseUrl;

			gridControllerService.initListController($scope, gridColumns, dataService, validationService, {
				initCalled: false,
				columns: [],
				options: {
					editable: false,
					readonly: false
				}
			});

		}
	]);
})(angular);
