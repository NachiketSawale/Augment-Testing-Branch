/**
 * Created by lcn on 1/03/2024.
 */

(function () {

	'use strict';
	var moduleName = 'project.stock';

	angular.module(moduleName).controller('ProjectStock2ClerkListController', ['$scope', 'platformGridControllerService', 'ProjectStock2ClerkUIStandardService',
		'ProjectStock2ClerkValidationService', '$injector',
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
	angular.module(moduleName).controller('ProjectStock2ClerkDetailController', ['$scope', 'platformDetailControllerService', 'ProjectStock2ClerkUIStandardService',
		'ProjectStock2ClerkValidationService', 'platformTranslateService', '$injector',
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