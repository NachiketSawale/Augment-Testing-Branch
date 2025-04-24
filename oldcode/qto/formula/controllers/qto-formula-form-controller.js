( function (angular) {
	'use strict';

	angular.module('qto.formula').controller('qtoFormulaGridDetailController',
		['$scope', 'qtoFormulaDataUIStandardService', 'qtoFormulaDataService', 'platformDetailControllerService',
			'platformTranslateService', 'qtoFormulaValidationService',
			/* jshint -W072 */
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);