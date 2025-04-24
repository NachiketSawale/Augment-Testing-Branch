(function (angular){
	'use strict';

	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).controller('basicsProcurementConfigurationNarrativeScriptController', [
		'$scope',
		'basicsCommonScriptControllerService',
		'basicsProcurementConfigurationDataService',
		function ($scope,
			basicsCommonScriptControllerService,
			basicsProcurementConfigurationDataService) {

			$scope.selectedItem = basicsProcurementConfigurationDataService.getSelected();

			$scope.onScriptChange = function () {
				basicsProcurementConfigurationDataService.markItemAsModified($scope.selectedItem);
			};

			basicsProcurementConfigurationDataService.registerSelectedEntitiesChanged(function (e, args) {
				if (args && args.length) {
					$scope.selectedItem = args[0];
				} else {
					$scope.selectedItem = null;
				}
			});

			var options = {
				scriptId: 'basics.procurementconfiguration.script.narrative',
				apiId: 'ProcurementConfiguration.Narrative',
				lint: false,
				apiVersion: 2 // ClearScript engine
			};

			basicsCommonScriptControllerService.initController($scope, options);
		}
	]);

})(angular);