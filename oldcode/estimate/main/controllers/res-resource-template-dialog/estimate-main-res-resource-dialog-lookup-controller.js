/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global Slick, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).value('estimateMainResResourceDialogListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns : [
					{
						id: 1,
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						editor: null,
						width: 100
					},
					{
						id: 2,
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						editor: null,
						readonly: true
					},
					{
						id: 'UomFk',
						field: 'UomBasisFk',
						name: 'Uom',
						width: 50,
						name$tr$: 'basics.costcodes.uoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					},
					{
						id: 'Rate',
						field: 'Rate',
						name: 'Market Rate',
						formatter: 'money',
						width: 70,
						name$tr$: 'basics.costcodes.unitRate'
					},
					{
						id: 'CurrencyFk',
						field: 'CurrencyFk',
						name: 'Currency',
						width: 50,
						name$tr$: 'cloud.common.entityCurrency',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'currency',
							displayMember: 'Currency'
						}
					}
				]
			};
		}
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainResResourceDialogLookupController',
		['$scope', 'estimateMainResResourceDialogLookupService', 'estimateMainResResourceDialogListColumns', 'platformGridAPI', 'platformGridControllerService',
			function ($scope, estimateMainResResourceDialogLookupService, estimateMainResResourceDialogListColumns, platformGridAPI, platformGridControllerService) {

				$scope.gridId = '60f49573f9f4401db5d2701254d008c4';
				$scope.isLoading = false;

				let grid = null;
				let myGridConfig = {
					enableConfigSave: true,
					editorLock: new Slick.EditorLock(),
					// multiSelect: false,
					rowChangeCallBack: function () {
						$scope.modalOptions.disableOkButton = false;
					}
				};

				estimateMainResResourceDialogLookupService.doNotLoadOnSelectionChange(true);
				platformGridControllerService.initListController($scope, estimateMainResResourceDialogListColumns, estimateMainResResourceDialogLookupService, {}, myGridConfig);

				if (platformGridAPI.grids.exist($scope.gridId)){
					grid = platformGridAPI.grids.element('id', $scope.gridId);
					angular.extend(grid.options, myGridConfig);
				}

				function onSelectedRowsChanged(e, args){
					if (estimateMainResResourceDialogLookupService.getIsListBySearch()) {
						return;
					}

					let rows = args.rows;
					let selectedItems = estimateMainResResourceDialogLookupService.onMultipleSelection(grid, rows);
					estimateMainResResourceDialogLookupService.setMultipleSelectedItems(selectedItems);

					if ($scope.enableMultiSelection){
						$scope.modalOptions.disableOkButton = _.isEmpty(estimateMainResResourceDialogLookupService.getMultipleSelectedItems());
						$scope.modalOptions.selectedItems = selectedItems;
					}else{
						$scope.modalOptions.disableOkButton = _.isEmpty(estimateMainResResourceDialogLookupService.getSelectedEntities());
					}
					$scope.$root.safeApply();
				}

				function onDblClick(){
					$scope.modalOptions.ok();
				}

				function onListLoaded(){
					if (estimateMainResResourceDialogLookupService.getIsInit() === false){
						if ($scope.enableMultiSelection){
							let multipleSelectedItems = estimateMainResResourceDialogLookupService.getMultipleSelectedItems();
							estimateMainResResourceDialogLookupService.setSelectedEntities(multipleSelectedItems);

							let ids = _.map(multipleSelectedItems, 'Id');
							let rows = grid.dataView.mapIdsToRows(ids);
							grid.instance.setSelectedRows(rows, true);
						}else{
							estimateMainResResourceDialogLookupService.setMultipleSelectedItems([]);
						}
						estimateMainResResourceDialogLookupService.setIsListBySearch(false);

						$scope.isLoading = false;
					}
				}

				function loadingIndicator(){
					$scope.isLoading = true;
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);

				// estimateMainResResourceDialogLookupService.setMultiSelection.register(onMultipleSelection);
				estimateMainResResourceDialogLookupService.registerListLoaded(onListLoaded);
				// estimateMainResResourceDialogLookupService.resetMultipleSelection.register(resetMultipleSelection);
				estimateMainResResourceDialogLookupService.showLoadingIndicator.register(loadingIndicator);
				estimateMainResResourceDialogLookupService.init($scope.$parent.options);

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
					// estimateMainResResourceDialogLookupService.setMultiSelection.unregister(onMultipleSelection);
					estimateMainResResourceDialogLookupService.unregisterListLoaded(onListLoaded);
					// estimateMainResResourceDialogLookupService.resetMultipleSelection.unregister(resetMultipleSelection);
					estimateMainResResourceDialogLookupService.showLoadingIndicator.unregister(loadingIndicator);
				});
			}]);
})();
