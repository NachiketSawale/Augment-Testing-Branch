/**
 * Created by alm on 8/24/2020.
 */
(function (angular) {
	'use strict';

	angular.module('basics.taxcode').controller('basicsTaxCodeListController', ['$scope', 'globals', 'platformGridControllerService', 'basicsTaxCodeUIStandardService', 'basicsTaxCodeValidationService', 'basicsTaxCodeMainService',
		function ($scope, globals, gridControllerService, gridColumns, validationService, dataService) {
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
