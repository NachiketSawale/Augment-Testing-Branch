/**
 * Created by lav on 11/27/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportReturnResourcesSelectController', Controller);
	Controller.$inject = [
		'$scope',
		'$injector',
		'$http',
		'platformRuntimeDataService',
		'platformGridAPI',
		'$interval',
		'platformModuleStateService'];

	function Controller($scope,
						$injector,
						$http,
						platformRuntimeDataService,
						platformGridAPI,
						$interval,
						platformModuleStateService) {

		var returnResourcesSelectService = $injector.get($scope.steps[0].service);
		initializeScope();
		initializeGrid();

		var autoCommitCell = $interval(function () {
			var resourceGrid = platformGridAPI.grids.element('id', $scope.gridOptions.resourceGrid.state);
			if (resourceGrid && resourceGrid.instance) {
				var tmp = resourceGrid.instance.getEditorLock().isActive();
				if (tmp && resourceGrid.instance.getActiveCell() &&
					resourceGrid.instance.getColumns()[resourceGrid.instance.getActiveCell().cell].name === 'Selected' &&
					resourceGrid.instance.getCellEditor()) {
					if (resourceGrid.instance.getCellEditor().isValueChanged()) {
						resourceGrid.instance.getEditorLock().commitCurrentEdit();
						var currentItem = getSelectedItem($scope.gridOptions.resourceGrid.state);
						changeTrsQuantity(currentItem);
						platformGridAPI.rows.refreshRow({
							'gridId': $scope.gridOptions.resourceGrid.state,
							'item': currentItem
						});
					}
				}
			}
		}, 100);

		function initializeScope() {
			returnResourcesSelectService.initialize($scope);
		}

		function initializeGrid() {
			_.forEach($scope.gridOptions, function (grid) {
				var gridConfig = {
					id: grid.state,
					columns: grid.columns,
					options: {
						indicator: true,
						idProperty: grid.idProperty,
						enableConfigSave: true,
						enableModuleConfig: true,
						saveSearch: false

					}
				};
				gridConfig.columns.current = gridConfig.columns;
				platformGridAPI.grids.config(gridConfig);
			});

			platformGridAPI.events.register($scope.gridOptions.jobGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register($scope.gridOptions.resourceGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register($scope.gridOptions.resourceGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.events.register($scope.gridOptions.resourceGrid.state, 'onHeaderCheckboxChanged', onHeaderCheckboxChanged);
		}

		$scope.$on('$destroy', function () {
			$interval.cancel(autoCommitCell);
			var modState = platformModuleStateService.state(returnResourcesSelectService.getModule());
			if (modState.validation && modState.validation.issues) {
				modState.validation.issues.length = 0;//delete all the issues
			}
			platformGridAPI.events.unregister($scope.gridOptions.jobGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridOptions.resourceGrid.state, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridOptions.resourceGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridOptions.resourceGrid.state, 'onHeaderCheckboxChanged', onHeaderCheckboxChanged);
			platformGridAPI.grids.unregister($scope.gridOptions.jobGrid.state);
			platformGridAPI.grids.unregister($scope.gridOptions.resourceGrid.state);
			platformGridAPI.grids.unregister($scope.gridOptions.resourcePlanGrid.state);
		});

		var preSelected;

		function onSelectedRowsChanged(e, args) {
			var selected = getSelectedItem(args.grid.options.id);
			switch (args.grid.options.id) {
				case $scope.gridOptions.jobGrid.state:
					//validate the quantity if need
					if ($scope.forUnplanned) {
						if (!returnResourcesSelectService.raiseValidation()) {
							platformGridAPI.rows.selection({
								gridId: args.grid.options.id,
								rows: [preSelected]
							});
							return;
						}
					}
					preSelected = selected;
					if (selected) {
						_.forEach(selected.Resources, function (resource) {
							if (!Object.prototype.hasOwnProperty.call(resource,'Checked')) {
								resource.Checked = false;
							}
							if (!resource.OriginalId) {
								resource.OriginalId = resource.Id;
							}
							if (!resource.OrigRemainingQuantity) {
								resource.OrigRemainingQuantity = resource.RemainingQuantity;
							}
							resource.Id = selected.Id + '/' + resource.OriginalId;
						});
					}
					returnResourcesSelectService.setList($scope.gridOptions.resourceGrid.state, selected ? selected.Resources : []);
					//refreshHeaderChk();
					break;
				case $scope.gridOptions.resourceGrid.state:
					returnResourcesSelectService.setList($scope.gridOptions.resourcePlanGrid.state, selected ? selected.Plans : []);
					break;
			}
		}

		function onHeaderCheckboxChanged(e) {
			if (!e.target.checked) {
				returnResourcesSelectService.clearValidationIssues(platformGridAPI.rows.getRows($scope.gridOptions.resourceGrid.state));
			}
			cascadeChecked();
			$scope.$evalAsync();
		}

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'Checked') {
				if (!args.item.Checked) {
					returnResourcesSelectService.clearValidationIssues([args.item]);
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
			selected.Checked = !!_.find(platformGridAPI.rows.getRows($scope.gridOptions.resourceGrid.state), {'Checked': true});
			if (!notChangeTrsQuantity) {
				_.forEach(selected.Resources, function (res) {
					changeTrsQuantity(res);
				});
			}
			platformGridAPI.grids.refresh($scope.gridOptions.jobGrid.state, true);
			returnResourcesSelectService.getResult();
		}

		function refreshHeaderChk() {
			//to refresh the headerchkbox
			var grid = platformGridAPI.grids.element('id', $scope.gridOptions.resourceGrid.state);
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