/**
 * Created by chd on 12/15/2021.
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsMeetingAttendeeDetailController',
		['$scope', 'platformDetailControllerService', 'basicsMeetingAttendeeService', 'basicsMeetingAttendeeValidationService', 'basicsMeetingAttendeeUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService(dataService), uiService, platformTranslateService);
			}]);
})(angular);
