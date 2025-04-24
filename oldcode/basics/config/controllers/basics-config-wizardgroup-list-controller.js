/**
 * Created by sandu on 27.01.2016.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigWizardGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the wizardgroup list view
	 **/
	angModule.controller('basicsConfigWizardGroupListController', basicsConfigWizardGroupListController);

	basicsConfigWizardGroupListController.$inject = ['$scope', 'basicsConfigWizardGroupService', 'basicsConfigWizardGroupUIService', 'basicsConfigWizardGroupValidationService', 'platformGridControllerService', 'platformGridAPI', '$timeout', 'wizardGroupClipboardService'];

	function basicsConfigWizardGroupListController($scope, basicsConfigWizardGroupService, basicsConfigWizardGroupUIService, basicsConfigWizardGroupValidationService, platformGridControllerService, platformGridAPI, $timeout, wizardGroupClipboardService) {

		var toolbarItems = [
			{
				id: 't1',
				caption: 'basics.config.createDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-add',
				fn: function () {
					basicsConfigWizardGroupService.processInputDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigWizardGroupService.hasSelection() || basicsConfigWizardGroupService.getSelected().Version === 0 || basicsConfigWizardGroupService.getSelected().AccessRightDescriptor !== null;
				}
			},
			{
				id: 't1',
				caption: 'basics.config.deleteDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-delete',
				fn: function () {
					basicsConfigWizardGroupService.processYesNoDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigWizardGroupService.hasSelection() || basicsConfigWizardGroupService.getSelected().Version === 0 || basicsConfigWizardGroupService.getSelected().AccessRightDescriptor === null;
				}
			}
		];


		var myGridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: wizardGroupClipboardService,
			type:'wizardGroup'};
		platformGridControllerService.initListController($scope, basicsConfigWizardGroupUIService, basicsConfigWizardGroupService, basicsConfigWizardGroupValidationService, myGridConfig);
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