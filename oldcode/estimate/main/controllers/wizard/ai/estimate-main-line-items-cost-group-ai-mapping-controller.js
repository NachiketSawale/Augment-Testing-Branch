/**
 * @author: chd
 * @date: 10/19/2020 1:58 PM
 * @description:
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainLineItemsCostGroupAiMappingController', [
		'_',
		'$scope',
		'$injector',
		'$translate',
		'platformGridControllerService',
		'$http',
		'platformModalService',
		'platformGridAPI',
		'estimateMainService',
		'estimateMainLineItemsCostGroupAiMappingService',
		'estimateMainLineItemsCostGroupAiMappingDataService',
		'estimateMainLineItemsCostGroupAiMappingConfiguration',
		'estimateMainLineItemsCostGroupAiMappingTranslationService',
		'estimateMainLineItemsCostGroupAiMappingValidationService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformRuntimeDataService',
		function (
			_,
			$scope,
			$injector,
			$translate,
			platformGridControllerService,
			$http,
			platformModalService,
			platformGridAPI,
			estimateMainService,
			estimateMainLineItemsCostGroupAiMappingService,
			dataService,
			gridUIStandardService,
			translationService,
			ValidationService,
			basicsCommonHeaderColumnCheckboxControllerService,
			platformRuntimeDataService) {

			let _params = $scope.$parent.modalOptions.params,
				fieldTag = 'costgroup_',
				suggestedFieldTag = 'suggested_costgroup_';

			angular.extend($scope.modalOptions, {
				LineItemsCostGroupAiMappingResult: $translate.instant('estimate.main.aiWizard.lineItemsCostGroupAiMappingResult'),
				Update: $translate.instant('estimate.main.aiWizard.update'),
				Cancel: $translate.instant('estimate.main.aiWizard.cancel')
			});

			$scope.busyInfo = '';
			$scope.isBusy = false;

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}

			estimateMainLineItemsCostGroupAiMappingService.busyStatusChanged.register(busyStatusChanged);

			$scope.gridId = _params.gridId;
			$scope.gridData = {
				state: $scope.gridId
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				let grid = {
					data: {},
					columns: angular.copy(gridUIStandardService.getStandardConfigForListView().columns),
					id: $scope.gridId,
					lazyInit: false,
					options: {
						idProperty: 'Id',
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
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);

			let headerCheckBoxFields = ['IsCheckAi'];
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

			estimateMainLineItemsCostGroupAiMappingService.setSelectedLevel(_params.levelSelect);

			function checkAll(e) {
				let isSelected = (e.target.checked);
				let gridData = platformGridAPI.items.data($scope.gridId);
				let allCostGroupCats = estimateMainLineItemsCostGroupAiMappingService.getCostGroupCats();

				if (gridData !== null && gridData.length > 0) {
					_.forEach (gridData, function (item) {
						let canChecked = false;
						_.forEach (allCostGroupCats, function (costGroupCat) {
							if (item[fieldTag + costGroupCat.Id] !== item[suggestedFieldTag + costGroupCat.Id] && item[suggestedFieldTag + costGroupCat.Id] !== null) {
								canChecked = true;
							}
						});

						if (canChecked) {
							item.IsCheckAi = isSelected;
						} else {
							item.IsCheckAi = false;
						}
					});
				}
			}

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [],
				update: function () {
					return;
				}
			};

			$scope.setTools = function (/* tools */) {
			};

			function onSelectedRowsChanged() {
				let selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
					estimateMainLineItemsCostGroupAiMappingService.setSelectedId($scope.selectedItem.Id);
				}
			}

			function onCellModified(e, args) {
				let col = args.grid.getColumns()[args.cell];
				let entity = args.item;

				if (col.field.indexOf('suggested_') === -1) return;

				let lineItem2CostGroupsData = estimateMainLineItemsCostGroupAiMappingService.getLineItem2CostGroupsData();
				let isNewLineItem2CostGroupMapping = true;
				_.forEach(lineItem2CostGroupsData, function (lineItem2CostGroup) {
					if (lineItem2CostGroup.CostGroupCatFk === col.costGroupCatId && lineItem2CostGroup.MainItemId === entity.Id) {
						isNewLineItem2CostGroupMapping = false;
						if (col.field.indexOf('suggested_') > -1) {
							/* update */
							lineItem2CostGroup.SuggestedCostGroupFk = entity[col.field];
						}
					}
				});

				if (isNewLineItem2CostGroupMapping) {
					let newLineItem2CostGroupItem = {
						Id: 0,
						CostGroupCatFk: col.costGroupCatId,
						MainItemId: entity.Id,
						RootItemId: entity.EstHeaderFk,
						SuggestedCostGroupFk: entity[col.field]
					};

					lineItem2CostGroupsData.push(newLineItem2CostGroupItem);
					estimateMainLineItemsCostGroupAiMappingService.saveLineItem2CostGroupsData(lineItem2CostGroupsData);
				}

				CheckedIsCheckAi(entity);
			}

			function CheckedIsCheckAi (entity) {
				let isNeedChecked = false;
				let costGroupCats = estimateMainLineItemsCostGroupAiMappingService.getCostGroupCats();
				_.forEach (costGroupCats, function (costGroupCat) {
					if (entity[suggestedFieldTag + costGroupCat.Id.toString()] !== null && (entity[fieldTag + costGroupCat.Id.toString()] !== entity[suggestedFieldTag + costGroupCat.Id.toString()])) {
						isNeedChecked = true;
					}
				});

				if (!isNeedChecked) {
					entity.IsCheckAi = false;
					platformRuntimeDataService.readonly(entity, [{field: 'IsCheckAi', readonly: true}]);
				} else {
					entity.IsCheckAi = true;
					platformRuntimeDataService.readonly(entity, [{field: 'IsCheckAi', readonly: false}]);
				}

				platformGridAPI.grids.refresh($scope.gridId, true);
			}

			$scope.canUpdate = function () {
				let gridData = platformGridAPI.items.data($scope.gridId);
				return (_.findIndex(gridData, {IsCheckAi: true}) !== -1);
			};

			$scope.okClicked = function () {
				platformGridAPI.grids.commitAllEdits();
				let gridData = platformGridAPI.items.data($scope.gridId);
				let checkedLineItemId = [];
				_.forEach(gridData, function (item) {
					if (item.IsCheckAi) {
						checkedLineItemId.push(item.Id);
					}
				});

				let selectMappingData = [];
				let allMappingData = estimateMainLineItemsCostGroupAiMappingService.getLineItem2CostGroupsData();
				_.forEach(allMappingData, function (mappingItem) {
					if (checkedLineItemId.indexOf(mappingItem.MainItemId) !== -1 && mappingItem.SuggestedCostGroupFk !== null && mappingItem.SuggestedCostGroupFk !== mappingItem.CostGroupFk) {
						selectMappingData.push(mappingItem);
					}
				});

				let post = estimateMainLineItemsCostGroupAiMappingService.postData(selectMappingData);
				if (post) {
					post.then(function () {
						$scope.close(true);
						showAiSuccessfullyDoneMessage('estimate.main.aiWizard.lineItemsCostGroupMapping', 'estimate.main.aiWizard.mappingSuccessful');
						estimateMainService.load();
					});
				}
			};

			let myGridConfig = {
				initCalled: true,
				columns: [],
				idProperty: 'Id',
				grouping: false,
				uuid: _params.gridId
			};

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, gridUIStandardService, dataService, null, myGridConfig);
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataService, headerCheckBoxFields, headerCheckBoxEvents);
				dataService.load();
			}

			function costGroupLoaded(costGroupCatalogs) {
				$injector.get('basicsAICostGroupAssignmentService').addAICostGroupColumns($scope.gridId, gridUIStandardService, costGroupCatalogs, dataService, {});
			}

			dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

			/* refresh the columns configuration when controller is created */
			if (dataService.costGroupCatalogs) {
				costGroupLoaded(dataService.costGroupCatalogs);
			}

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

			// un-register on destroy
			$scope.$on('$destroy', function () {
				dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				estimateMainLineItemsCostGroupAiMappingService.clearCacheDataChanged();

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged');
					platformGridAPI.grids.unregister($scope.gridId);
				}

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange');
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			init();
		}]
	);

})(angular);
