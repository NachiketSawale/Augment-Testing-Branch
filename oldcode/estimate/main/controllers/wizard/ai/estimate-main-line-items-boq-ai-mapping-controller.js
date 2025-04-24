/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _backend_output */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimatelineitemsboqaimappingcontroller
	 * @function
	 *
	 * @description
	 * controller for line items boq ai mapping result grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainLineItemsBoqAiMappingController', [
		'$scope',
		'_',
		'$translate',
		'platformGridAPI',
		'basicsLookupdataLookupDescriptorService',
		'estimateMainLineItemsBoqAiMappingConfiguration',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformModalService',
		'estimateMainService',
		'estimateMainLineItemsBoqAiMappingDataService',
		'estimateMainLineItemsBoqAiMappingService',

		function ($scope,
			_,
			$translate,
			platformGridAPI,
			basicsLookupdataLookupDescriptorService,
			gridColumns,
			basicsCommonHeaderColumnCheckboxControllerService,
			platformModalService,
			estimateMainService,
			estimateMainLineItemsBoqAiMappingDataService,
			estimateMainLineItemsBoqAiMappingService) {

			let params = $scope.$parent.modalOptions.params;
			let backend_output = {};

			$scope.busyInfo = '';
			$scope.isBusy = false;

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}

			estimateMainLineItemsBoqAiMappingService.busyStatusChanged.register(busyStatusChanged);

			estimateMainLineItemsBoqAiMappingDataService.attachData(params.mappingData);
			basicsLookupdataLookupDescriptorService.attachData({BoqItem: params.mappingData.BoqItem});
			backend_output.data = estimateMainLineItemsBoqAiMappingService.updateReadOnly(params.mappingData.Main);

			$scope.gridId = params.gridId;
			$scope.gridData = {
				state: $scope.gridId
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				let grid = {
					data: backend_output.data,
					columns: angular.copy(gridColumns.getStandardConfigForListView().columns),
					id: $scope.gridId,
					lazyInit: true,
					options: {
						skipPermissionCheck: true,
						collapsed: false,
						indicator: true,
						enableDraggableGroupBy: false
					},
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			let headerCheckBoxFields = ['Selected'];
			// check all the rows if click the check box button on the header.
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);

			function checkAll(e) {
				let isSelected = (e.target.checked);
				let gridData = _backend_output.data;
				if (gridData !== null && gridData.length > 0) {
					_.forEach(gridData, function (item) {
						if (item.BoqItemFk === item.OrigBoqItemFk) {
							item.IsCheckAi = false;
						} else {
							item.IsCheckAi = isSelected;
						}
					});
				}
			}

			$scope.selectedItem = null;

			function onSelectedRowsChanged() {
				let selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
					estimateMainLineItemsBoqAiMappingService.setSelectedId($scope.selectedItem.Id);
				}
			}

			angular.extend($scope.modalOptions, {
				LineItemsBoqAiMappingResult: $translate.instant('estimate.main.aiWizard.lineItemsBoqAiMappingResult'),
				Update: $translate.instant('estimate.main.aiWizard.update'),
				Cancel: $translate.instant('estimate.main.aiWizard.cancel')
			});

			$scope.validateBoqItemFk = function (entity, value) {
				estimateMainLineItemsBoqAiMappingService.validateBoqItemFk(entity, value);
				basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, ['IsCheckAi']);
			};

			$scope.canUpdate = function () {
				let gridData = platformGridAPI.items.data($scope.gridId);
				return (_.findIndex(gridData, {IsCheckAi: true}) !== -1);
			};

			$scope.okClicked = function () {
				platformGridAPI.grids.commitAllEdits();
				params.values = backend_output.data;
				for (let i = 0; i < params.values.length; i++) {
					if (params.values[i].IsCheckAi) {
						let searchList = estimateMainLineItemsBoqAiMappingDataService.getCachedList(params.values[i].Id);
						let boqItem = _.find(searchList, {Id: params.values[i].BoqItemFk});
						if (angular.isObject(boqItem)) {
							params.values[i].BoqHeaderFk = boqItem.BoqHeaderFk;
						}
					}
				}
				let post = estimateMainLineItemsBoqAiMappingService.set(params.values);
				if (post) {
					post.then(function (response) {
						if (response.data) {
							$scope.close(true);
							showAiSuccessfullyDoneMessage('estimate.main.aiWizard.lineItemsBoqAiMapping', 'estimate.main.aiWizard.mappingSuccessful');
							estimateMainService.load();
						}
					});
				}
			};

			function showAiSuccessfullyDoneMessage(title, message) {
				let modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant(message),
					iconClass: 'ico-info'
				};
				return platformModalService.showDialog(modalOptions);
			}

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			$scope.options.height = 0;


		}
	]);
})(angular);
