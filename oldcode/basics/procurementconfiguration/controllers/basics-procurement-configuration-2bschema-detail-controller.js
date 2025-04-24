/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsProcurementConfig2BSchemaDetailController',
		['$scope','platformDetailControllerService', 'basicsProcurementConfiguration2BSchemaDataService',
			'basicsProcurementConfiguration2BSchemaValidationService', 'basicsProcurementConfiguration2BSchemaUIService','platformTranslateService',
			function ($scope,platformDetailControllerService, dataService, validationService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);

})(angular);