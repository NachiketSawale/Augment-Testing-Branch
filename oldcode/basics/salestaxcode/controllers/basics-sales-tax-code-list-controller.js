/**
 * Created by lcn on 11/4/2021.
 */
(function (angular) {
	'use strict';

	angular.module('basics.salestaxcode').controller('basicsSalesTaxCodeListController', ['$scope', '$injector', 'globals', 'platformGridControllerService', 'basicsSalesTaxCodeUIStandardService', 'basicsSalesTaxCodeValidationService', 'basicsSalesTaxCodeMainService',
		function ($scope, $injector, globals, gridControllerService, gridColumns, validationService, dataService) {
			$scope.path = globals.appBaseUrl;

			gridControllerService.initListController($scope, gridColumns, dataService, validationService, {
				initCalled: false,
				columns: [],
				options: {
					editable: false,
					readonly: false
				},
				type: 'basics.salestaxcode',
				dragDropService : $injector.get('basicsCommonClipboardService')
			});

		}
	]);
})(angular);
