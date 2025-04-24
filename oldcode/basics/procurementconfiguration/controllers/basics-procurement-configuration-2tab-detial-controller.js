
(function (angular) {

	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	var muduleName = 'basics.procurementconfiguration';
	angular.module(muduleName).controller('basicsProcurement2tabFormController',
		['$scope','platformDetailControllerService', 'basicsProcurementConfiguration2TabDataService',
			'basicsProcurementConfiguration2TabValidationService', 'basicsProcurementConfigModule2TabUIStandardService',
			'platformTranslateService',
			function ($scope,platformDetailControllerService, dataService, validationService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
