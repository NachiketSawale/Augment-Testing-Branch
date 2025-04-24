( function (angular) {
	'use strict';
	/* jshint -W072 */
	angular.module('qto.formula').controller('qtoFormulaUomDetailController',
		['$scope', 'qtoFormulaUomUIStandardService', 'qtoFormulaUomDataService', 'platformDetailControllerService',
			'platformTranslateService', 'qtoFormulaUomValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);

})(angular);