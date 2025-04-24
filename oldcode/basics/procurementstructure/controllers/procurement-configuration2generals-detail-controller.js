/**
 * Created by wuj on 1/15/2015.
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.procurementstructure';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsProcurementConfiguration2GeneralsDetailController',
		['$scope', 'basicsProcurementConfiguration2GeneralsUIStandardService', 'basicsProcurementConfiguration2GeneralsService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsProcurementConfiguration2GeneralsValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);

})(angular);
