(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainProjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of projects
	 **/
	angular.module(moduleName).controller('projectMainProjectListController', ProjectMainProjectListController);

	ProjectMainProjectListController.$inject = [
		'$rootScope', '$scope', '$timeout', '$injector', '$translate', 'platformGridAPI', 'projectMainConstantValues',
		'platformContainerControllerService', 'projectMainCostGroupCatalogConfigurationService'];

	function ProjectMainProjectListController(
		$rootScope, $scope, $timeout, $injector, $translate, platformGridAPI, projectMainConstantValues,
		platformContainerControllerService, projectMainCostGroupCatalogConfigurationService
	) {

		platformContainerControllerService.initController($scope, moduleName, projectMainConstantValues.uuid.container.projectList);
		var basCurrencyLookup = $injector.get('basicsCurrencyLookupService');
		basCurrencyLookup.loadLookupData();
		$rootScope.$on('deepCopyInProgress', function (eventObject, isInProgress) {
			if (isInProgress) {
				$scope.loadingText = $translate.instant('project.main.deepCopyInProgress');
				$scope.isLoading = isInProgress;
			} else {
				$scope.isLoading = isInProgress;
			}
		});
		var characterColumnService = $injector.get('projectMainCharacteristicColumnService');
		var projectMainService = $injector.get('projectMainService');
		var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(projectMainService, 40);

		characteristicDataService.registerItemValueUpdate(onItemUpdate);

		var tools = [{
			id: 'modalConfig',
			caption: $translate.instant('project.main.costGroupConfiguration'),
			type: 'item',
			cssClass: 'tlb-icons ico-settings-doc',
			fn: function() {
				var selected = projectMainService.getSelected();

				return projectMainCostGroupCatalogConfigurationService.editProjectCostGroupConfiguration(selected, projectMainService);
			},
			disabled: function () {
				var selected = projectMainService.getSelected();

				return !selected;
			}
		}];
		$scope.addTools(tools);

		function onItemUpdate(e, item) {
			characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
				if(item.CharacteristicEntity === null){
					item.CharacteristicEntity = data;
				}
				characterColumnService.checkColumn(item);
			});
		}

		characteristicDataService.registerItemDelete(onItemDelete);

		function onItemDelete(e, items) {
			characterColumnService.deleteColumns(items);
		}

		projectMainService.registerSelectionChanged(selectionChangedCallBack);

		function selectionChangedCallBack() {
			var parameterValueService = $injector.get('estimateProjectEstRuleParameterValueService');
			if (parameterValueService.getFilterStatus()) {
				parameterValueService.load();
			}

			$injector.get('estimateAssembliesCategoryLookupDataService').clear();

			$injector.get('projectCommonFilterButtonService').clear();
		}

		platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

		function onActiveCellChanged(e, arg) {
			var column = arg.grid.getColumns()[arg.cell];
			if (column) {
				var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
				var isCharacteristic = $injector.get('projectMainCharacteristicColumnService').isCharacteristicColumn(column);
				if (isCharacteristic) {
					var lineItem = projectMainService.getSelected();
					if (lineItem !== null) {
						var col = column.field;
						var colArray = _.split(col, '_');
						if (colArray && colArray.length > 1) {
							var characteristicType = colArray[_.lastIndexOf(colArray) - 2];
							var value = parseInt(characteristicType);
							var isLookup = characteristicTypeService.isLookupType(value);
							var updateColumn = isLookup ? col : undefined;
							projectMainService.setCharacteristicColumn(updateColumn);
						}
					}
				}
			}
		}

		/*
		$timeout(function () {
			characterColumnService.refresh();
		});
*/

		function clearProjectAssemblyCatalogFilter(){
			$injector.get('projectAssemblyFilterService').removeAllFilters();
		}
		projectMainService.registerSelectionChanged(clearProjectAssemblyCatalogFilter);

		$scope.$on('$destroy', function () {
			characteristicDataService.unregisterItemDelete(onItemDelete);
			characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
			projectMainService.unregisterSelectionChanged(selectionChangedCallBack);
			projectMainService.unregisterSelectionChanged(clearProjectAssemblyCatalogFilter);
		});
	}
})();
