(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).controller('constructionSystemCommonModelPropertyDetailController',
		['$scope', '$injector',
			'platformDetailControllerService', 'modelMainPropertyConfigurationService', 'platformTranslateService', 'constructionSystemCommonModelPropertyDataService',
			function ($scope, $injector,
				platformDetailControllerService, modelMainPropertyConfigurationService, translateService, dataServiceFactory) {

				// get environment variable from the module-container.json file
				var currentModuleName = $scope.getContentValue('currentModule');
				var parentServiceName = $scope.getContentValue('parentService');
				var parentService = $injector.get(parentServiceName);
				var dataService = dataServiceFactory.getService(currentModuleName,parentService);

				platformDetailControllerService.initDetailController($scope, dataService, {}, modelMainPropertyConfigurationService, translateService);

				function bindFormReadOnlyListener(formOptions){ // todo-mike: readonly logic should be done in data service. use platformRuntimeDataService
					if (formOptions.rows.length > 0) {
						var fromRows = formOptions.rows;
						angular.forEach(fromRows, function (row) {
							row.readonly = true;
						});
					}
				}
				bindFormReadOnlyListener($scope.formOptions.configure);
			}
		]);
})(angular);