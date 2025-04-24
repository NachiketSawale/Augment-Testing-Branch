/**
 * Created by wuj on 1/15/2015.
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.procurementstructure';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsProcurementConfiguration2CertDetailController',
		['$scope', 'basicsProcurementConfiguration2CertUIStandardService', 'basicsProcurementConfiguration2CertService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsProcurementConfiguration2CertValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

			}]);
})(angular);
