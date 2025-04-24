/**
 * Created by lcn on 11/4/2021.
 */
(function (angular) {
	'use strict';

	angular.module('basics.salestaxcode').controller('basicsSalesTaxMatrixListController', ['$scope', 'globals', 'platformGridControllerService', 'basicsSalesTaxMatrixUIStandardService', 'basicsSalesTaxMatrixService', 'basicsSalesTaxMatrixValidationService',
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
