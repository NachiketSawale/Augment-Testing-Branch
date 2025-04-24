(function () {
	'use strict';
	var moduleName = 'boq.wic';

	/**
	 * @ngdoc controller
	 * @name boqWicGroupNodeController
	 * @function
	 *
	 * @description
	 * Controller for the tree view of wic groups
	 **/
	angular.module(moduleName).controller('boqWicGroupNodeController',
		['$scope', 'platformGridControllerService', 'boqWicGroupService', 'boqWicGroupStandardConfigurationService', 'boqWicGroupValidationService', '$timeout', 'platformGridAPI',
			function ($scope, platformGridControllerService, boqWicGroupService, boqWicGroupStandardConfigurationService, boqWicGroupValidationService, $timeout, platformGridAPI) {

				var toolbarItems = [];

				var myGridConfig = {initCalled: false, grouping: true, parentProp: 'WicGroupFk', childProp: 'WicGroups'};
				platformGridControllerService.initListController($scope, boqWicGroupStandardConfigurationService, boqWicGroupService, boqWicGroupValidationService, myGridConfig);
				platformGridControllerService.addTools(toolbarItems);

				var updateTools = function () {
					$timeout($scope.tools.update, 0, true);
				};

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateTools);
				platformGridAPI.events.register($scope.gridId, 'onBeforeCellEditorDestroy', updateTools);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', updateTools);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeCellEditorDestroy', updateTools);
				});
			}
		]);
})();
