/**
 * Created by chd on 12/9/2021.
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsMeetingListController', ['$scope', 'globals', 'platformGridControllerService', 'basicsMeetingUIStandardService', 'basicsMeetingValidationService', 'basicsMeetingMainService',
		function ($scope, globals, gridControllerService, gridColumns, validationService, dataService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				options: {
					editable: false,
					readonly: false
				}
			};
			gridControllerService.initListController($scope, gridColumns, dataService, validationService(dataService), myGridConfig);
		}
	]);
})(angular);
