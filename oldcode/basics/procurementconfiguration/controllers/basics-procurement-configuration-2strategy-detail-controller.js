/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsProcurementConfig2StrategyDetailController',
		['$scope','platformDetailControllerService', 'basicsProcurementConfiguration2StrategyDataService',
			'basicsProcurementConfiguration2StrategyValidationService', 'basicsProcurementConfiguration2StrategyUIService','platformTranslateService',
			function ($scope,platformDetailControllerService, dataService, validationService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);

})(angular);