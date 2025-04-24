/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemsActivityAiMappingController
	 * @function
	 *
	 * @description
	 * controller for line items activity ai mapping result grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainLineItemsActivityAiMappingController', [
		'$scope',
		'_',
		'$translate',
		'platformGridAPI',
		'basicsLookupdataLookupDescriptorService',
		'estimateMainLineItemsActivityAiMappingConfiguration',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformModalService',
		'estimateMainService',
		'estimateMainLineItemsActivityAiMappingDataService',
		'estimateMainLineItemsActivityAiMappingService',
		function (
			$scope,
			_,
			$translate,
			platformGridAPI,
			basicsLookupdataLookupDescriptorService,
			gridColumns,
			basicsCommonHeaderColumnCheckboxControllerService,
			platformModalService,
			estimateMainService,
			estimateMainLineItemsActivityAiMappingDataService,
			estimateMainLineItemsActivityAiMappingService) {

			let params = $scope.$parent.modalOptions.params;
			let backend_output = {};

			$scope.busyInfo = '';
			$scope.isBusy = false;

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}

			estimateMainLineItemsActivityAiMappingService.busyStatusChanged.register(busyStatusChanged);

			$scope.validateActivityFk = function (entity, value) {
				estimateMainLineItemsActivityAiMappingService.validateActivityFk(entity, value);
				basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, ['IsCheckAi']);
			};

			estimateMainLineItemsActivityAiMappingDataService.attachData(params.mappingData);
			basicsLookupdataLookupDescriptorService.attachData({PsdActivity: params.mappingData.PsdActivity});
			backend_output.data = estimateMainLineItemsActivityAiMappingService.updateReadOnly(params.mappingData.Main);

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
				let gridData = backend_output.data;
				if (gridData !== null && gridData.length > 0) {
					_.forEach(gridData, function (item) {
						if (item.PsdActivityFk === item.OrigPsdActivityFk) {
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
					estimateMainLineItemsActivityAiMappingService.setSelectedId($scope.selectedItem.Id);
				}
			}

			angular.extend($scope.modalOptions, {
				LineItemsActivityAiMappingResult: $translate.instant('estimate.main.aiWizard.lineItemsActivityAiMappingResult'),
				Update: $translate.instant('estimate.main.aiWizard.update'),
				Cancel: $translate.instant('estimate.main.aiWizard.cancel')
			});

			$scope.validateActivityItemFk = function (entity, value) {
				estimateMainLineItemsActivityAiMappingService.validateActivityItemFk(entity, value);
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
						let searchList = estimateMainLineItemsActivityAiMappingDataService.getCachedList(params.values[i].Id);
						let psdActivity = _.find(searchList, {Id: params.values[i].PsdActivityFk});
						if (angular.isObject(psdActivity)) {
							params.values[i].PsdActivityFk = psdActivity.Id;
						}
					}
				}
				let post = estimateMainLineItemsActivityAiMappingService.set(params.values);
				if (post) {
					post.then(function (response) {
						if (response.data) {
							$scope.close(true);
							showAiSuccessfullyDoneMessage('estimate.main.aiWizard.lineItemsActivityAiMapping', 'estimate.main.aiWizard.mappingSuccessful');
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

