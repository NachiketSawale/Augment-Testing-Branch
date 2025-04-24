( function (angular) {
	'use strict';

	angular.module('qto.formula').controller('qtoFormulaCommentDetailController',
		['$scope', 'qtoFormulaCommentDataUIStandardService', 'qtoFormulaCommentService', 'platformDetailControllerService',
			'platformTranslateService', 'qtoFormulaCommentValidationService',
			/* jshint -W072 */
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);