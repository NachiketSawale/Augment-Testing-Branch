/**
 * Created by sandu on 31.03.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigTabListController
	 * @function
	 *
	 * @description
	 * Controller for the  tab list view
	 **/
	angModule.controller('basicsConfigTabListController', basicsConfigTabListController);

	basicsConfigTabListController.$inject = ['$scope', 'basicsConfigTabService', 'basicsConfigTabUIService', 'basicsConfigTabValidationService', 'platformGridControllerService', '$timeout','platformGridAPI'];

	function basicsConfigTabListController($scope, basicsConfigTabService, basicsConfigTabUIService, basicsConfigTabValidationService, platformGridControllerService, $timeout, platformGridAPI) {

		var myGridConfig = {initCalled: false, columns: []};

		var toolbarItems = [
			{
				id: 't1',
				caption: 'basics.config.createDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-add',
				fn: function () {
					basicsConfigTabService.processInputDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigTabService.hasSelection() || basicsConfigTabService.getSelected().Version === 0 || basicsConfigTabService.getSelected().AccessRightDescriptor !== null;
				}
			},
			{
				id: 't1',
				caption: 'basics.config.deleteDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-delete',
				fn: function () {
					basicsConfigTabService.processYesNoDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigTabService.hasSelection() || basicsConfigTabService.getSelected().Version === 0 || basicsConfigTabService.getSelected().AccessRightDescriptor === null;
				}
			}
		];

		platformGridControllerService.initListController($scope, basicsConfigTabUIService, basicsConfigTabService, basicsConfigTabValidationService, myGridConfig);
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
})();
