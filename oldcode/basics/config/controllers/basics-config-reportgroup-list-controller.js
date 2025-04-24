/**
 * Created by sandu on 23.04.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc controller
     * @name basicsConfigReportGroupListController
     * @function
     *
     * @description
     * Controller for the  reportgroup list view
     **/
	angModule.controller('basicsConfigReportGroupListController', basicsConfigReportGroupListController);

	basicsConfigReportGroupListController.$inject = ['$scope', 'basicsConfigReportGroupService', 'basicsConfigReportGroupUIService', 'basicsConfigReportGroupValidationService', 'platformGridControllerService','platformGridAPI','$timeout'];

	function basicsConfigReportGroupListController($scope, basicsConfigReportGroupService, basicsConfigReportGroupUIService, basicsConfigReportGroupValidationService, platformGridControllerService, platformGridAPI, $timeout) {

		var toolbarItems = [
			{
				id: 't1',
				caption: 'basics.config.createDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-add',
				fn: function () {
					basicsConfigReportGroupService.processInputDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigReportGroupService.hasSelection() || basicsConfigReportGroupService.getSelected().Version === 0 || basicsConfigReportGroupService.getSelected().AccessRightDescriptor !== null;
				}
			},
			{
				id: 't1',
				caption: 'basics.config.deleteDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-delete',
				fn: function () {
					basicsConfigReportGroupService.processYesNoDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigReportGroupService.hasSelection() || basicsConfigReportGroupService.getSelected().Version === 0 || basicsConfigReportGroupService.getSelected().AccessRightDescriptor === null;
				}
			}
		];


		var myGridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, basicsConfigReportGroupUIService, basicsConfigReportGroupService, basicsConfigReportGroupValidationService, myGridConfig);
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