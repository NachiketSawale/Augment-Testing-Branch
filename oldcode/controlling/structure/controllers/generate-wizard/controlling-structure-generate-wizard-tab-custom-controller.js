/**
 * Created by janas on 25.01.2016.
 */

(function () {

	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingStructureGenerateWizardTabCustomController
	 * @function
	 *
	 * @description
	 * Controller for generate controlling units wizard.
	 **/
	controllingStructureModule.controller('controllingStructureGenerateWizardTabCustomController',
		['$scope', 'platformGridAPI', 'platformTranslateService', 'controllingStructureWizardGenerateCustomService',
			function Controller($scope, platformGridAPI, platformTranslateService, generateCustomService) {

				$scope.gridId = '1097289d50f8443a9bcf64f1422886cf';
				$scope.gridData = {
					state: $scope.gridId
				};

				var columns = [
					{
						id: 1,
						formatter: 'string',
						field: 'code',
						editor: 'description',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						toolTip: 'Code',
						toolTip$tr$: 'cloud.common.entityCode'
					},
					{
						id: 2,
						formatter: 'string',
						field: 'description',
						editor: 'description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						toolTip: 'Description',
						toolTip$tr$: 'cloud.common.entityDescription'
					}
				];

				if (!columns.isTranslated) {
					platformTranslateService.translateGridConfig(columns);
					columns.isTranslated = true;
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: angular.copy(columns),
						data: [],
						id: $scope.gridId,
						lazyInit: false,
						enableConfigSave: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id'
						}
					};

					platformGridAPI.grids.config(grid);
				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(columns));
				}

				// Define standard toolbar Icons and their function on the scope
				$scope.tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: generateCustomService.createItem,
							disabled: false
						},
						{
							id: 't2',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: deleteItem,
							disabled: function canDeleteItem() {
								return angular.isUndefined(getSelected());
							}
						},
						{
							id: 'd1',
							sort: 55,
							type: 'divider'
						},
						{
							id: 't111',
							sort: 112,
							caption: 'cloud.common.gridlayout',
							iconClass: 'tlb-icons ico-settings',
							type: 'item',
							fn: function () {
								platformGridAPI.configuration.openConfigDialog($scope.gridId);
							},
							disabled: function () {
								return $scope.showInfoOverlay;
							}
						}
					]
				};

				platformGridAPI.events.register($scope.gridId, 'onAddNewRow', generateCustomService.createItem);

				function onCreatedItem(item) {
					platformGridAPI.rows.add({gridId: $scope.gridId, item: item});
					platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, item);
				}

				function getSelected() {
					return platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
				}

				function deleteItem() {
					var selected = getSelected();
					generateCustomService.deleteItem(selected);
				}

				function updateItemList() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.items.data($scope.gridId, generateCustomService.getList());
					}
				}

				updateItemList();

				generateCustomService.onItemCreated.register(onCreatedItem);
				generateCustomService.onItemDeleted.register(updateItemList);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onAddNewRow', generateCustomService.createItem);

					generateCustomService.onItemCreated.unregister(onCreatedItem);
					generateCustomService.onItemDeleted.unregister(updateItemList);

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});

			}]);

})();
