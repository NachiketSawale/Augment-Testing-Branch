/**
 * Created by lcn on 9/20/2021.
 */

(function () {

	'use strict';
	var moduleName = 'project.stock';

	angular.module(moduleName).controller('projectStockDownTimeListController', ['$scope', 'platformGridControllerService', 'projectStockDownTimeUIStandardService',
		'projectStockDownTimeValidationService', '$injector',
		function ($scope, platformGridControllerService, gridColumns, validationService, $injector) {
			var gridConfig = {initCalled: false, columns: []};
			var dataService = $scope.getContentValue('dataService');
			if (angular.isString(dataService)) {
				dataService = $injector.get(dataService);
			}
			if (angular.isFunction(dataService)) {
				dataService = dataService.call(this);
			}
			validationService = validationService(dataService);
			platformGridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

		}
	]);
	angular.module(moduleName).controller('projectStockDownTimeDetailController', ['$scope', 'platformDetailControllerService', 'projectStockDownTimeUIStandardService',
		'projectStockDownTimeValidationService', 'platformTranslateService', '$injector',
		function ($scope, platformDetailControllerService, gridColumns, validationService, platformTranslateService, $injector) {
			var dataService = $scope.getContentValue('dataService');
			if (angular.isString(dataService)) {
				dataService = $injector.get(dataService);
			}
			if (angular.isFunction(dataService)) {
				dataService = dataService.call(this);
			}
			validationService = validationService(dataService);
			platformDetailControllerService.initDetailController($scope, dataService, validationService, gridColumns, platformTranslateService);

		}
	]);
})();