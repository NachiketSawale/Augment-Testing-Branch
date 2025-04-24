(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterTestParameterInputController',
		['$scope',
			'platformGridControllerService',
			'constructionSystemMasterTestParameterInputUIStandardService',
			'constructionSystemMasterTestInputValidationService',
			'constructionSystemMasterTestDataService',
			function (
				$scope,
				platformGridControllerService,
				constructionSystemMasterTestParameterInputUIStandardService,
				constructionSystemMasterTestInputValidationService,
				constructionSystemMasterTestDataService) {

				var myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'PId',
					childProp: 'ChildrenItem',
					enableDraggableGroupBy: false
				};

				constructionSystemMasterTestDataService.registerSelectionChanged = constructionSystemMasterTestDataService.registerSelectionChanged2('grid');

				platformGridControllerService.initListController(
					$scope,
					constructionSystemMasterTestParameterInputUIStandardService,
					constructionSystemMasterTestDataService,
					constructionSystemMasterTestInputValidationService,
					myGridConfig);

				constructionSystemMasterTestDataService.scriptValidator.register(constructionSystemMasterTestInputValidationService.validateValue);
				constructionSystemMasterTestDataService.scriptValidator.fire();
				$scope.$on('$destroy', function () {
					constructionSystemMasterTestDataService.scriptValidator.unregister(constructionSystemMasterTestInputValidationService.validateValue);
				});
			}
		]);

})(angular);