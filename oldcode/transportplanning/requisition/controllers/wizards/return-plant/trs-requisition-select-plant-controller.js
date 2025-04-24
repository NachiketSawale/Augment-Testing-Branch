/**
 * Created by anl on 12/29/2020.
 */
(function (angular) {
	'use strict';
	/*global angular, Slick, _*/

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionSelectPlantController', SelectPlantController);

	SelectPlantController.$inject = [
		'$scope',
		'$injector',
		'$http',
		'platformRuntimeDataService',
		'platformGridAPI',
		'transportplanningRequisitionSelectPlantService',
		'$interval',
		'platformModuleStateService'];

	function SelectPlantController(
		$scope,
		$injector,
		$http,
		platformRuntimeDataService,
		platformGridAPI,
		selectPlantService,
		$interval,
		platformModuleStateService) {

		selectPlantService.initialize($scope);

		var autoCommitCell = $interval(function () {
			var plantGrid = platformGridAPI.grids.element('id', $scope.gridOptions.plantGrid.state);
			if (plantGrid && plantGrid.instance) {
				var tmp = plantGrid.instance.getEditorLock().isActive();
				if (tmp && plantGrid.instance.getActiveCell() &&
					plantGrid.instance.getColumns()[plantGrid.instance.getActiveCell().cell].name === 'Selected' &&
					plantGrid.instance.getCellEditor()) {
					if (plantGrid.instance.getCellEditor().isValueChanged()) {
						plantGrid.instance.getEditorLock().commitCurrentEdit();
						var currentItem = getSelectedItem($scope.gridOptions.plantGrid.state);
						changeTrsQuantity(currentItem);
						platformGridAPI.rows.refreshRow({
							'gridId': $scope.gridOptions.plantGrid.state,
							'item': currentItem
						});
					}
				}
			}
		}, 100);

		_.forEach($scope.gridOptions, function (grid) {
			var gridConfig = {
				id: grid.state,
				columns: grid.columns,
				options: {
					indicator: true,
					idProperty: grid.idProperty,
					enableConfigSave: true,
					saveSearch: false

				}
			};
			gridConfig.columns.current = gridConfig.columns;
			platformGridAPI.grids.config(gridConfig);
		});

		platformGridAPI.events.register($scope.gridOptions.jobGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
		platformGridAPI.events.register($scope.gridOptions.plantGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
		platformGridAPI.events.register($scope.gridOptions.plantGrid.state, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.gridOptions.plantGrid.state, 'onHeaderCheckboxChanged', onHeaderCheckboxChanged);

		$scope.$on('$destroy', function () {
			$interval.cancel(autoCommitCell);
			var modState = platformModuleStateService.state(selectPlantService.getModule());
			if (modState.validation && modState.validation.issues) {
				modState.validation.issues.length = 0;//delete all the issues
			}
			platformGridAPI.events.unregister($scope.gridOptions.jobGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridOptions.plantGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridOptions.plantGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridOptions.plantGrid.state, 'onHeaderCheckboxChanged', onHeaderCheckboxChanged);
			platformGridAPI.grids.unregister($scope.gridOptions.jobGrid.state);
			platformGridAPI.grids.unregister($scope.gridOptions.plantGrid.state);
			platformGridAPI.grids.unregister($scope.gridOptions.planGrid.state);
		});

		var preSelected;

		function onSelectedRowsChanged(e, args) {
			var selected = getSelectedItem(args.grid.options.id);
			switch (args.grid.options.id) {
				case $scope.gridOptions.jobGrid.state:
					//validate the quantity if need
					if ($scope.forUnplanned) {
						if (!selectPlantService.raiseValidation()) {
							platformGridAPI.rows.selection({
								gridId: args.grid.options.id,
								rows: [preSelected]
							});
							return;
						}
					}
					preSelected = selected;
					if (selected) {
						_.forEach(selected.Plants, function (plant) {
							if (!Object.prototype.hasOwnProperty.call(plant,'Checked')) {
								plant.Checked = false;
							}
							if (!plant.OriginalId) {
								plant.OriginalId = plant.Id;
							}
							if (!plant.OrigRemainingQuantity) {
								plant.OrigRemainingQuantity = plant.RemainingQuantity;
							}
							plant.Id = selected.Id + '/' + plant.OriginalId;
						});
					}
					selectPlantService.setList($scope.gridOptions.plantGrid.state, selected ? selected.Plants : []);
					//refreshHeaderChk();
					break;
				case $scope.gridOptions.plantGrid.state:
					if(selected) {
						_.forEach(selected.Plans, function (plan) {
							if(typeof(plan.TransportDate) === 'string') {
								plan.TransportDate = moment.utc(plan.TransportDate);
							}
						});
					}
					selectPlantService.setList($scope.gridOptions.planGrid.state, selected ? selected.Plans : []);
					break;
			}
		}

		function onHeaderCheckboxChanged(e) {
			if (!e.target.checked) {
				selectPlantService.clearValidationIssues(platformGridAPI.rows.getRows($scope.gridOptions.plantGrid.state));
			}
			cascadeChecked();
			$scope.$evalAsync();
		}

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'Checked') {
				if (!args.item.Checked) {
					selectPlantService.clearValidationIssues([args.item]);
				}
				changeTrsQuantity(args.item);
				cascadeChecked();
			} else if (col === 'TransportQuantity') {
				calculateQuantity(args.item);
				if (!args.item.Checked && args.item[col] > 0) {
					args.item.Checked = true;
					//refreshHeaderChk();
					cascadeChecked(true);
				}
				platformGridAPI.rows.refreshRow({'gridId': args.grid.id, 'item': args.item});
			}
		}

		function changeTrsQuantity(item) {
			if ($scope.forUnplanned) {
				if (item.Checked) {
					item.TransportQuantity = item.OrigRemainingQuantity > 0 ? item.OrigRemainingQuantity : 0;
				} else {
					item.TransportQuantity = null;
				}
				calculateQuantity(item);
			}
		}

		function calculateQuantity(item) {
			item.RemainingQuantity = item.OrigRemainingQuantity - item.TransportQuantity;
			if (item.RemainingQuantity > item.OrigRemainingQuantity) {
				item.RemainingQuantity = item.OrigRemainingQuantity;
			}
		}

		function cascadeChecked(notChangeTrsQuantity) {
			var selected = getSelectedItem($scope.gridOptions.jobGrid.state);
			selected.Checked = !!_.find(platformGridAPI.rows.getRows($scope.gridOptions.plantGrid.state), {'Checked': true});
			if (!notChangeTrsQuantity) {
				_.forEach(selected.Plants, function (res) {
					changeTrsQuantity(res);
				});
			}
			platformGridAPI.grids.refresh($scope.gridOptions.jobGrid.state, true);
			selectPlantService.getResult();
		}

		function refreshHeaderChk() {
			//to refresh the headerchkbox
			var grid = platformGridAPI.grids.element('id', $scope.gridOptions.plantGrid.state);
			var chk = new Slick.CheckboxColumn({
				objectHelper: $injector.get('platformObjectHelper'),
				runtimeDataService: $injector.get('platformRuntimeDataService'),
				$rootScope: $injector.get('$rootScope'),
				$injector: $injector
			});
			grid.instance.registerPlugin(chk);
			grid.instance.unregisterPlugin(chk);
		}

		function getSelectedItem(gridId) {
			var selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			return selected;
		}
	}
})(angular);