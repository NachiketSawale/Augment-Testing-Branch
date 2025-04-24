(function (angular) {
	'use strict';
	var moduleName = 'qto.formula';
	angular.module(moduleName).controller('qtoFormulaController',
		['$scope', 'qtoFormulaRubricCategoryDataService', 'platformMainControllerService',
			'basicsMaterialTranslationService', 'qtoFormulaRubricCategoryDataService',

			function ($scope, mainDataService, platformMainControllerService, translateService, qtoFormulaRubricCategoryDataService) {
				var opt = {search: false, reports: true};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, mainDataService, {},
					translateService, moduleName, opt);
				qtoFormulaRubricCategoryDataService.load();
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(mainDataService, sidebarReports, translateService, opt);
				});
			}]);
})(angular);
