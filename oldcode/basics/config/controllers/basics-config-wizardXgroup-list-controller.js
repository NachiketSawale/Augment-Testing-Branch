/**
 * Created by sandu on 28.01.2016.
 */
(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigWizardXGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the wizardXgroup list view
	 **/
	angModule.controller('basicsConfigWizardXGroupListController', basicsConfigWizardXGroupListController);

	basicsConfigWizardXGroupListController.$inject = ['$scope', 'basicsConfigWizardXGroupService', 'basicsConfigWizardXGroupUIService', 'basicsConfigWizardXGroupValidationService', 'platformGridControllerService', 'platformModuleStateService', 'platformGridAPI', '$timeout', '$rootScope', 'platformDragdropService', 'wizardGroupClipboardService'];

	function basicsConfigWizardXGroupListController($scope, basicsConfigWizardXGroupService, basicsConfigWizardXGroupUIService, basicsConfigWizardXGroupValidationService, platformGridControllerService, platformModuleStateService, platformGridAPI, $timeout, $rootScope, platformDragdropService, wizardGroupClipboardService) {

		var myGridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: wizardGroupClipboardService,
			type:'wizardToGroup',
			allowedDragActions: [platformDragdropService.actions.copy,platformDragdropService.actions.move]
		};

		var toolbarItems = [
			{
				id: 't1',
				caption: 'basics.config.createDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-add',
				fn: function () {
					basicsConfigWizardXGroupService.processInputDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigWizardXGroupService.hasSelection() || basicsConfigWizardXGroupService.getSelected().Version === 0 || basicsConfigWizardXGroupService.getSelected().AccessRightDescriptor !== null;
				}
			},
			{
				id: 't1',
				caption: 'basics.config.deleteDesc',
				type: 'item',
				cssClass: 'tlb-icons ico-right-delete',
				fn: function () {
					basicsConfigWizardXGroupService.processYesNoDialog().then(function () {
						$scope.tools.update();
					});
				},
				disabled: function () {
					return !basicsConfigWizardXGroupService.hasSelection() || basicsConfigWizardXGroupService.getSelected().Version === 0 || basicsConfigWizardXGroupService.getSelected().AccessRightDescriptor === null;
				}
			}
		];
		/**
		 * watch for wizard lookup
		 */
		$scope.$watch(function () {
			if (basicsConfigWizardXGroupService.getSelected()) {
				return basicsConfigWizardXGroupService.getSelected().WizardFk;
			}
		}, function (newValue, oldValue) {
			if (newValue !== oldValue) {
				// state.selectedWizard = newValue;
				if(newValue > 0){
					$rootScope.$emit('selectedWizardChanged', newValue);
					var selectedItem = basicsConfigWizardXGroupService.getSelected();
					if(selectedItem.Name.Translated === null){
						basicsConfigWizardXGroupService.getWizardById(newValue).then(function(response){
							selectedItem.Name.Translated = response.Name;
							selectedItem.Name.Description = response.Name;
							basicsConfigWizardXGroupService.setSelected(selectedItem);
							basicsConfigWizardXGroupService.gridRefresh();
						});
					}
				}
			}
		});


		platformGridControllerService.initListController($scope, basicsConfigWizardXGroupUIService, basicsConfigWizardXGroupService, basicsConfigWizardXGroupValidationService, myGridConfig);
		platformGridControllerService.addTools(toolbarItems);

		function updateTools() {
			$timeout($scope.tools.update, 0, true);
		}

		platformGridAPI.events.register($scope.gridId, 'onBeforeCellEditorDestroy', updateTools);
		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateTools);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeCellEditorDestroy', updateTools);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', updateTools);
		});
	}
})();