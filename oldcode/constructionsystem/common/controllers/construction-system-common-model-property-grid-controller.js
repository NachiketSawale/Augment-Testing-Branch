(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).controller('constructionSystemCommonModelPropertyGridController',
		['$scope', '$injector', 'platformGridControllerService', 'modelMainPropertyConfigurationService', 'platformGridAPI', 'constructionSystemCommonModelPropertyDataService',
			function ($scope, $injector, platformGridControllerService, modelMainPropertyConfigurationService, platformGridAPI, dataServiceFactory) {
				var listConfig = {
					initCalled: false,
					grouping: true,
					enableColumnReorder: false,
					enableConfigSave: false,
					idProperty: 'idString'
				};
					// get environment variable from the module-container.json file
				var currentModuleName = $scope.getContentValue('currentModule');
				var parentServiceName = $scope.getContentValue('parentService');
				var parentService = $injector.get(parentServiceName);
				var dataService = dataServiceFactory.getService(currentModuleName,parentService);

				platformGridControllerService.initListController($scope, modelMainPropertyConfigurationService, dataService, {}, listConfig);

				var setCellEditable = function (/* e, arg */) {// todo-mike: readonly logic should be done in data service.use platformRuntimeDataService
					return false;
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});
			}
		]);
})(angular);