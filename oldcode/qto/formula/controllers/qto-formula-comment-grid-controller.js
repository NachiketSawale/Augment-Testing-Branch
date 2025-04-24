(function (angular) {
	'use strict';
	angular.module('qto.formula').controller('qtoFormulaCommentController',
		['$scope', 'platformGridControllerService', 'qtoFormulaCommentDataUIStandardService', 'qtoFormulaCommentService', 'qtoFormulaCommentValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validationService) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			}]);
})(angular);