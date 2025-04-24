/**
 * Created by wuj on 1/20/2015.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialCharacteristicDetailController',
		['$scope', 'basicsMaterialCharacteristicStandardConfigurationService', 'basicsMaterialCharacteristicService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsMaterialCharacteristicValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

			}]);
})(angular);
