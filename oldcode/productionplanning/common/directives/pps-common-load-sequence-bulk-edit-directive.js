/*
 * Created by mik on 08/11/2021.
 */
/* global globals */
(function () {
	'use strict';

	const moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonLoadSequenceBulkEditDirective',
		['_', '$', '$timeout', '$compile', '$translate', 'moment', 'productionplanningCommonLoadSequenceDataService',
			'basicsCommonDialogGridControllerService', 'ppsCommonFieldSequenceGridColumnConstant',
			'platformGridAPI', 'productionplanningCommonLoadSequenceBulkDataService',
			function (_, $, $timeout, $compile, $translate, moment, productionplanningCommonLoadSequenceDataService,
				basicsCommonDialogGridControllerService, ppsCommonFieldSequenceGridColumnConstant,
				platformGridAPI, productionplanningCommonLoadSequenceBulkDataService) {

				const gridColumns = ppsCommonFieldSequenceGridColumnConstant;
				const gridUUID = '06a9bd57675843bc8e74ca08bd55c442';

				let onTimeChanged = (time) => {
					let selectedEntities = platformGridAPI.rows.selection({
						gridId: gridUUID,
						wantsArray: true
					});
					productionplanningCommonLoadSequenceBulkDataService.updateSelected('time', time, selectedEntities);
					platformGridAPI.items.data(gridUUID, productionplanningCommonLoadSequenceBulkDataService.getList());
					platformGridAPI.grids.refresh(gridUUID);
					platformGridAPI.rows.selection({
						gridId: gridUUID,
						rows: selectedEntities
					});
				};

				let onGridRenderCompleted = () => {
					const selected = productionplanningCommonLoadSequenceDataService.getSelectedFlat();
					if (selected.length > 0) {
						platformGridAPI.rows.selection({
							gridId: gridUUID,
							rows: selected
						});
					}
				};

				const onCellChange = (e, args) => {
					const col = args.grid.getColumns()[args.cell].field;
					if (col === 'time') {
						let value = args.item.time;
						productionplanningCommonLoadSequenceBulkDataService.updateSelected('time', value, [args.item]);
					}
				};

				function getTools() {
					return [
						{
							id: 't13',
							sort: 9,
							caption: 'productionplanning.common.wizard.loadSequence.selectAll',
							iconClass: 'tlb-icons ico-selection-multi',
							type: 'item',
							fn: () => {
								platformGridAPI.rows.selection({
									gridId: gridUUID,
									rows: productionplanningCommonLoadSequenceBulkDataService.getList()
								});
							},
							disabled: false
						},
						{
							id: 't12',
							sort: 10,
							caption: 'productionplanning.common.wizard.loadSequence.flipSelected',
							iconClass: 'tlb-icons ico-replace',
							type: 'item',
							fn: () => {
								productionplanningCommonLoadSequenceBulkDataService.invertSelectedEntities();
								platformGridAPI.items.data(gridUUID, productionplanningCommonLoadSequenceBulkDataService.getList());
								platformGridAPI.grids.refresh(gridUUID);
							},
							disabled: () => {
								return !productionplanningCommonLoadSequenceBulkDataService.isSelectedContinual();
							}
						}
					];
				}

				var controller = ['$scope', function ($scope) {
					const onRowChanged = (e, args) => {
						let selectedEntities = platformGridAPI.rows.selection({
							gridId: args.grid.id,
							wantsArray: true
						});
						$timeout($scope.tools.update, 0, true);

						productionplanningCommonLoadSequenceBulkDataService.setSelected({}, selectedEntities);
					};

					const bulkTool = () => {
						let bulkTool = getTools();
						bulkTool.permission = '';
						$scope.tools.items = [];
						$scope.tools.items = bulkTool;
						$timeout($scope.tools.update, 0, true);
						$scope.setTools($scope.tools);
					};

					$scope.gridId = gridUUID;

					if (!platformGridAPI.grids.exist($scope.gridId)) {
						productionplanningCommonLoadSequenceBulkDataService.setList(productionplanningCommonLoadSequenceDataService.getProducts());
						const grid = {
							columns: gridColumns,
							data: productionplanningCommonLoadSequenceBulkDataService.getList(),
							uuid: gridUUID,
							lazyInit: true,
							idProperty: 'Id',
							enableConfigSave: false,
							enableCopyPasteExcel: false,
							skipPermissionCheck: true,
							grouping: false,
							isStaticGrid: true
						};
						// platformGridAPI.grids.config(grid);

						let uiService = {
							getStandardConfigForListView: () => {
								return {
									columns: gridColumns
								};
							},
							getDtoScheme: () => {
								return {};
							}
						};

						basicsCommonDialogGridControllerService.initListController($scope, uiService, productionplanningCommonLoadSequenceBulkDataService, {}, grid);


						platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
						platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onRowChanged);

						// un-register on destroy
						$scope.$on('$destroy', function () {
							platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onRowChanged);
							platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
						});

						setTimeout(() => {
							onGridRenderCompleted();
						}, 500);
					}

					$timeout(() => {
						bulkTool();
					}, 300);

					$scope.formData = {
						bulkTime: moment.utc().startOf('day')
					};
					// $scope.onTimeChanged = onTimeChanged;

					$scope.gridData = {
						state: $scope.gridId
					};

					var formConfig = {
						fid: 'bulkEdit',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [
							{
								gid: 'default',
								rid: 'bulkEditTime',
								label: $translate.instant('productionplanning.common.wizard.loadSequence.bulkTime'),
								model: 'bulkTime',
								type: 'timeutc',
								change: function (entity) {
									onTimeChanged(entity.bulkTime);
								},
								readonly: false,
								sortOrder: 1
							}
						]
					};
					$scope.formOptions = {
						configure: formConfig
					};

					$scope.formContainerOptions = {
						formOptions: $scope.formOptions
					};
				}];

				return {
					restrict: 'A',
					scope: {
						ngModel: '='
					},
					// template: template,
					templateUrl: globals.appBaseUrl + 'productionplanning.common/templates/pps-common-load-sequence-bulk-edit-dialog.html',
					// link: linkFn,
					controller: controller
				};
			}
		]
	);
})();
