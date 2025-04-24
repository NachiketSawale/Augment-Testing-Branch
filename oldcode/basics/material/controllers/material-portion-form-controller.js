(function () {
	'use strict';
	/* global angular */
	var moduleName = 'basics.material';
	angular.module(moduleName).controller('basicsMaterialPortionFormController', [
		'$scope',
		'basicsMaterialPortionStandardConfigurationService',
		'basicsMaterialPortionDataService',
		'platformDetailControllerService',
		'platformTranslateService',
		'basicsMaterialPortionValidationService',
		function (
			$scope,
			formConfiguration,
			dataService,
			detailControllerService,
			translateService,
			validationService
		) {
			detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
		}]);
})();