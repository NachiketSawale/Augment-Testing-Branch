/**
 * Created by lid on 8/3/2017.
 */
/* global Slick */
(function () {

	'use strict';

	const moduleName = 'basics.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('treeviewListDialogListController', TreeviewListDialogListController);

	TreeviewListDialogListController.$inject = ['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', '_'];

	function TreeviewListDialogListController($scope, $injector, platformGridAPI, platformGridControllerService, _) {

		const listService = $injector.get($scope.modalOptions.listServiceName);
		const listColumns = $injector.get($scope.modalOptions.listColumnsServiceName);

		$scope.gridId = $scope.modalOptions.listGridID;
		$scope.isLoading = false;

		let grid = null;

		const myGridConfig = {
			editorLock: new Slick.EditorLock(),
			multiSelect: true,
			rowChangeCallBack: function () {
				$scope.modalOptions.disableOkButton = false;
			}
		};

		listService.doNotLoadOnSelectionChange(true);
		platformGridControllerService.initListController($scope, listColumns, listService, {}, myGridConfig);

		if (platformGridAPI.grids.exist($scope.gridId)) {
			grid = platformGridAPI.grids.element('id', $scope.gridId);
			grid.isStaticGrid = true;// set isStaticGrid to true to avoid load configuration
			angular.extend(grid.options, myGridConfig);
		}

		function onSelectedRowsChanged(e, args) {

			if (listService.getIsListBySearch()) {
				return;
			}

			const rows = args.rows;
			if ($scope.enableMultiSelection) {
				const selectedItems = listService.onMultipleSelection(grid, rows);
				listService.setMultipleSelectedItems(selectedItems);
				$scope.modalOptions.selectedItems = selectedItems;
				$scope.modalOptions.disableOkButton = _.isEmpty(listService.getMultipleSelectedItems());
			} else {
				$scope.modalOptions.disableOkButton = _.isEmpty(listService.getSelectedEntities());
			}
			$scope.$root.safeApply();
		}

		function onListLoaded() {
			if (listService.getIsInit() === false) {
				if ($scope.enableMultiSelection) {
					const multipleSelectedItems = listService.getMultipleSelectedItems();
					listService.setSelectedEntities(multipleSelectedItems);

					const ids = _.map(multipleSelectedItems, 'Id');
					const rows = grid.dataView.mapIdsToRows(ids);
					grid.instance.setSelectedRows(rows, true);
				}
				listService.setIsListBySearch(false);

				$scope.isLoading = false;
			}
		}

		function resetMultipleSelection() {
			listService.setMultipleSelectedItems([]);
			$scope.modalOptions.selectedItems = [];
			$scope.modalOptions.disableOkButton = _.isEmpty(listService.getSelectedEntities());
			$scope.$root.safeApply();
		}

		function loadingIndicator() {
			$scope.isLoading = true;
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		listService.registerListLoaded(onListLoaded);
		listService.resetMultipleSelection.register(resetMultipleSelection);
		listService.init($scope.$parent.options);

		listService.showLoadingIndicator.register(loadingIndicator);

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
			listService.unregisterListLoaded(onListLoaded);
			listService.resetMultipleSelection.unregister(resetMultipleSelection);
			listService.showLoadingIndicator.unregister(loadingIndicator);
		});
	}
})();