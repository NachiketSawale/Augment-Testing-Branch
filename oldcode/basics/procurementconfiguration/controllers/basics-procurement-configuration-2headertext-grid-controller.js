/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsProcurementConfig2HeaderTextGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementConfiguration2HeaderTextDataService',
			'basicsProcurementConfiguration2HeaderTextValidationService', 'basicsProcurementConfiguration2HeaderTextUIService',
			function ($scope, gridControllerService, dataService, validationService, uiService) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
			}]);

})(angular);