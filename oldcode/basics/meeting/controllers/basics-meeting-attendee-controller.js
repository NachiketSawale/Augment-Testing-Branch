/**
 * Created by chd on 12/15/2021.
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsMeetingAttendeeController', ['$scope', 'globals', 'platformGridControllerService', 'basicsMeetingAttendeeUIStandardService', 'basicsMeetingAttendeeService', 'basicsMeetingAttendeeValidationService',
		function ($scope, globals, gridControllerService, gridColumns, dataService, validationService) {
			$scope.path = globals.appBaseUrl;

			gridControllerService.initListController($scope, gridColumns, dataService, validationService(dataService), {
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
