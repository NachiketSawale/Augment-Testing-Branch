(function (angular) {
	'use strict';
	var moduleName = 'qto.formula';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('qtoFormulaValidationScriptTranslationGridController',
		['$scope', 'platformGridControllerService', 'qtoFormulaValidationScriptTranslationUIStandardService', 'qtoFormulaValidationScriptTranslationValidationService',
			'qtoFormulaValidationScriptTranslationDataService',
			function ($scope, gridControllerService, qtoFormulaValidationScriptTranslationUIStandardService, validationService, dataService) {
				let gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack:function cellChangeCallBack(){
						return null;
					}
				};

				gridControllerService.initListController($scope, qtoFormulaValidationScriptTranslationUIStandardService, dataService, validationService, gridConfig);

				$scope.$on('$destroy', function () {

				});
			}]);
})(angular);