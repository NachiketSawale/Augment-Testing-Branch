/**
 * Created by gaz on 04/05/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.materialcatalog';

	/**
	 * @ngdoc controller
	 * @name basicsMaterialCatalogGroupAiMappingController
	 * @function
	 *
	 * @description
	 * controller for material group to procurement structure auto mapping data grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMaterialCatalogGroupAiMappingController', [
		'$scope',
		'$http',
		'$translate',
		'platformGridAPI',
		'materialCatalogGroupAiMappingService',
		'basicsMaterialCatalogGroupSuggestedPrcStructureDataService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCharacteristicTypeHelperService',
		'basicsMaterialCatalogGroupAiMappingUIStandardService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformSidebarWizardCommonTasksService',
		function ($scope,
				  $http,
				  $translate,
				  platformGridAPI,
				  materialCatalogGroupAiMappingService,
				  basicsMaterialCatalogGroupSuggestedPrcStructureDataService,
				  basicsLookupdataLookupDescriptorService,
				  basicsCharacteristicTypeHelperService,
				  gridColumns,
				  basicsCommonHeaderColumnCheckboxControllerService,
				  platformSidebarWizardCommonTasksService)
		{

			$scope.isBusy = false;
			$scope.busyInfo = '';

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}
			materialCatalogGroupAiMappingService.busyStatusChanged.register(busyStatusChanged);

			var _params = $scope.$parent.modalOptions.params;
			$scope.selectedItem = null;  			// selected material group

			$scope.gridId = _params.gridId;

			var _userInput = {};
			_userInput.data = materialCatalogGroupAiMappingService.updateReadOnly(_params.materialGroupData.Main);

			basicsMaterialCatalogGroupSuggestedPrcStructureDataService.attachData(_params.materialGroupData);
			basicsLookupdataLookupDescriptorService.attachData({Prcstructure: _params.materialGroupData.Prcstructure});

			$scope.gridData = {
				state: $scope.gridId
			};

			angular.extend($scope.modalOptions, {
				headerText: $translate.instant('basics.materialcatalog.ai.aiMapping'),
				update: $translate.instant('basics.materialcatalog.update'),
				cancel: $translate.instant('cloud.common.cancel')
			});

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: _userInput.data,
					columns: angular.copy(gridColumns.getStandardConfigForListView().columns),
					id: $scope.gridId,
					options: {
						tree: true,
						childProp: 'ChildItems',
						skipPermissionCheck: true,
						parentProp: 'MaterialGroupFk',
						idProperty: 'Id',
						collapsed: false,
						indicator: true,
						enableDraggableGroupBy: false
					},
					lazyInit: true,
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			var headerCheckBoxFields = ['IsCheckAi'];
			var headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);

			function checkAll(e) {
				var isSelected = (e.target.checked);
				var gridData = _userInput.data;
				resetSelectedChildren(gridData, isSelected);
			}

			function resetSelectedChildren(children, value) {
				if (children && children.length > 0) {
					_.forEach(children, function (child) {
						if (child.PrcStructureFk === child.OrigPrcStructureFk) {
							child.IsCheckAi = false;
						} else {
							child.IsCheckAi = value;
						}
						resetSelectedChildren(child.ChildItems, value);
					});
				}
			}

			function onSelectedRowsChanged() {
				var selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
					materialCatalogGroupAiMappingService.setSelectedId($scope.selectedItem.Id);
				}
			}

			function hasUpdate(items) {
				if (items && items.length > 0) {
					for (var i = 0; i < items.length; i++) {
						if (items[i].IsCheckAi || hasUpdate(items[i].ChildItems)) {
							return true;
						}
					}
				}
				return false;
			}

			function sendFeedback(items) {
				/* jshint -W106*/
				var all_items = flatten(items);
				$http.post(globals.webApiBaseUrl +'basics/materialcatalog/group/mtwoai/aimapprcstructurefeedback',all_items);
			}

			function flatten(items) {
				var all = [];
				_.forEach(items, function (item) {
					if (item) {
						all.push(item);
					}
				});
				for (var i = 0; i < all.length; i++) {
					var children = all[i].ChildItems;
					if (children && children.length > 0) {
						/* jshint -W083*/
						_.forEach(children, function (child) {
							if (child) {
								all.push(child);
							}
						});
					}
				}
				return all;
			}

			$scope.validatePrcStructureFk = function (entity, value) {
				materialCatalogGroupAiMappingService.validatePrcStructureFk(entity, value);
				basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, ['IsCheckAi']);
			};

			$scope.canUpdate = function () {
				var gridData = platformGridAPI.items.data($scope.gridId);
				return hasUpdate(gridData);
			};


			$scope.okClicked = function () {
				platformGridAPI.grids.commitAllEdits();
				_params.values = _userInput.data;
				sendFeedback(_params.values);
				materialCatalogGroupAiMappingService.set(_params.values);
				$scope.close(true);
				platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('basics.materialcatalog.ai.autoMappingHeader', $translate.instant('basics.materialcatalog.ai.autoMappingDone'));
			};

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

			$scope.options.height = 0;

		}
	]);
})(angular);