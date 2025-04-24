/**
 * Created by chd on 12/9/2021.
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsMeetingDetailController',
		['$scope', 'platformDetailControllerService', 'basicsMeetingMainService', 'basicsMeetingValidationService', 'basicsMeetingUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiService, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService(dataService), uiService, platformTranslateService);
			}]);
})(angular);
