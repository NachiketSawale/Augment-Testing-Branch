/*
 * Created by mik on 04/10/2021.
 */
/* global globals */
(function () {
	'use strict';

	const moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonLoadSequenceGridDirective',
		['_', '$', '$timeout', '$compile', '$injector', '$translate', 'moment', 'platformGridAPI', 'mainViewService',
			'productionplanningCommonLoadSequenceDataService', 'productionplanningCommonClipboardService',
			'basicsCommonDialogGridControllerService', 'ppsCommonFieldSequenceGridColumnConstant', 'platformModalService',
			'productionplanningCommonLoadSequenceDateManipulationService', 'ppsCommonFieldSequenceUuidConstant',
			function (_, $, $timeout, $compile, $injector, $translate, moment, platformGridAPI, mainViewService,
				productionplanningCommonLoadSequenceDataService, productionplanningCommonClipboardService,
				basicsCommonDialogGridControllerService, ppsCommonFieldSequenceGridColumnConstant, platformModalService,
				productionplanningCommonLoadSequenceDateManipulationService, ppsCommonFieldSequenceUuidConstant) {

				const gridColumns = ppsCommonFieldSequenceGridColumnConstant;
				const leadingGridUUID = ppsCommonFieldSequenceUuidConstant.leadingGridUUID;

				const statusBarConfig = [{
					id: 'testText',
					type: 'text',
					value: 'Test Text'
				}];

				// region create
				function createDayTools(model, gridId) {
					return {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 't20',
								sort: 20,
								caption: 'productionplanning.common.wizard.loadSequence.addDays',
								type: 'item',
								iconClass: 'tlb-icons ico-date-shift-left',
								fn: () => {
									let maxAddTo = productionplanningCommonLoadSequenceDateManipulationService.getMaxAddTo(model);
									openDatePicker(model, 'add', maxAddTo);
								},
								disabled: () => {
									return !productionplanningCommonLoadSequenceDateManipulationService.isAddAble(model);
								}
							},
							{
								id: 't10',
								sort: 10,
								caption: 'productionplanning.common.wizard.loadSequence.skipDays',
								type: 'item',
								iconClass: 'tlb-icons ico-date-shift-right',
								fn: () => {
									openDatePicker(model, 'skip');
								},
								disabled: false
							},
							{
								id: 't1',
								sort: 0,
								caption: 'cloud.common.taskBarNewRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-new',
								fn: () => {
									let selectedRows = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true}).filter(row => row.nodeInfo.level > 0);

									if (selectedRows.length > 0) {
										const productIds = selectedRows.map(row => row.Id);
										productionplanningCommonLoadSequenceDataService.createNewLoad(model.Id, productIds);
										refreshGrid(gridId, productIds[0]);
									}
								},
								disabled: () => {
									if (platformGridAPI.rows.selection({gridId: gridId, wantsArray: true}) && platformGridAPI.rows.selection({gridId: gridId, wantsArray: true}).length > 0) {
										let selectedRows = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true}).filter(row => row && row.nodeInfo.level > 0);
										return !(selectedRows.length > 0);
									}
									return true;
								}
							}
						]
					};
				}

				function createGrid(title) {
					return '<div data-platform-dragdrop-component="ddTarget" class="flex-element" style="height: 100%;">' +
						'<div class="subview-header toolbar flex-box flex-row">' +
						'<h3 class="font-bold title fix">' + title + '</h3>' +
						'<div data-platform-menu-list data-list="dayTools"></div>' +
						'</div>' +
						//'<platform-Grid data="gridData"></platform-Grid>' +
						'<div data-platform-grid class="subview-container" data-data="gridData" style="height: 400px;"></div>' +
						createStatusBar() +
						'</div>';
				}

				function createStatusBar() {
					// todo: make own directive out of this part
					return '<div class="statusbar-wrapper ng-scope ng-isolate-scope" style="position: relative;">'+
						'<div class="statusbar flex-box flex-row" style="display: flex; flex-wrap: wrap; overflow: auto">'+
						'<div>'+
						'<span class="item ellipsis">'+$translate.instant('productionplanning.common.wizard.loadSequence.stretchRate')+': {{sequence.data.productCount}} / '+
						'<input type="number" data-ng-model="sequence.data.stretchRate" data-ng-change="onStretchRateChanged(sequence.data.stretchRate, sequence.data.rowId)" style="background: white; border: 0; width: 36px; height: 18px; padding: 0 2px;">'+
						'</span>'+
						'</div>'+
						'<div>'+
						'<div class="item">'+$translate.instant('productionplanning.common.wizard.loadSequence.loadCount')+': {{sequence.data.loadCount}} | '+$translate.instant('productionplanning.common.wizard.loadSequence.totalTime')+': {{sequence.data.totalTimeFormatted}}</div>'+
						'</div>'+
						'</div>'+
						'</div>';
				}
				// endregion

				// region helper functions
				function refreshGrid(uuid, productId) {
					platformGridAPI.items.data(uuid, productionplanningCommonLoadSequenceDataService.getLoadsOfDayByProduct(productId));
					platformGridAPI.grids.refresh(uuid);
				}

				let openDatePicker = (model, type, maxMoment) => {
					let modelFrom = model.PlannedStart.startOf('day');
					let modelTo = moment(modelFrom);
					let isDisabledChangeDate = true;

					const onChangeDate = (from, to) => {
						modelTo = to;
						if (type === 'add') {
							isDisabledChangeDate = !!(from.isSame(to, 'day') || to.isAfter(from, 'day')) || to.isBefore(maxMoment, 'day');
						} else {
							isDisabledChangeDate = !!(from.isSame(to, 'day') || from.isAfter(to, 'day'));
						}
					};

					let headerText = (type === 'add') ? $translate.instant('productionplanning.common.wizard.loadSequence.addDays') : $translate.instant('productionplanning.common.wizard.loadSequence.skipDays');
					let buttonText = (type === 'add') ? $translate.instant('productionplanning.common.wizard.loadSequence.add') : $translate.instant('productionplanning.common.wizard.loadSequence.skip');

					let modalOptions = {
						width: '300px',
						maxWidth: '300px',
						minWidth: '300px',
						headerText: headerText,
						bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.common/templates/pps-common-date-picker.html',
						showOkButton: false,
						showCancelButton: true,
						customButtons: [
							{
								id: 'action',
								caption: buttonText,
								fn: (button, event, closeFn) => {
									productionplanningCommonLoadSequenceDateManipulationService.moveDays(modelFrom, modelTo);
									closeFn();
								},
								disabled: function () {
									return isDisabledChangeDate;
								},
								autoClose: true
							}
						],
						value: {
							modelFrom,
							modelTo,
							onChangeDate
						}
					};

					platformModalService.showDialog(modalOptions);
				};
				// endregion

				// region events
				const onCellChange = (e, args) => {
					const col = args.grid.getColumns()[args.cell].field;
					if (col === 'time') {
						const productSeconds = moment.duration(args.item.time.format('HH:mm')).asSeconds();
						productionplanningCommonLoadSequenceDataService.setProductTime(args.item.Id, productSeconds);
						args.item.setProductHasChanged();
						productionplanningCommonLoadSequenceDataService.recalculateTimes();
						refreshGrid(args.grid.id, args.item.Id);
					}
				};

				const onInitialized = (e, args) => {
					productionplanningCommonLoadSequenceDataService.onLeadingGridInitialized.fire(false);
				};

				const onRowChanged = (e, args) => {
					let selectedEntities = platformGridAPI.rows.selection({
						gridId: args.grid.id,
						wantsArray: true
					});
					productionplanningCommonLoadSequenceDataService.setSelectedByGrid(args.grid.id, selectedEntities);
				};

				const onStretchRateChanged = (stretchRate, dayId) => {
					productionplanningCommonLoadSequenceDataService.setStretchRateOfDay(dayId, stretchRate);
				};
				// endregion

				const controller = ['$scope', function ($scope) {
				}];

				function linkFn($scope, $elem, attrs) {
					const gridUUID = $scope.sequence.state;

					$scope.dayTools = [];
					$scope.statusBarConfig = statusBarConfig;

					let gridTemplate = '';
					let gridData = $scope.sequence.data;

					$scope.gridData = {
						state: gridUUID
					};
					$scope.onStretchRateChanged = onStretchRateChanged;
					$scope.dayTools = createDayTools(gridData, gridUUID);

					const grid = {
						data: gridData.loads,
						columns: [],
						uuid: gridUUID,
						tree: true,
						treeWidth: 70,
						indicator: true,
						idProperty: 'Id',
						childProp: 'children',
						parentProp: 'Id',
						initialState: 'expanded',
						hierarchyEnabled: true,
						dragDropService: productionplanningCommonClipboardService,
						lazyInit: true,
						enableColumnSort: true,
						enableConfigSave: true,
						enableModuleConfig: true, // enables module specific save
						isStaticGrid: (gridUUID !== leadingGridUUID) // check if it is the first "leading" container with loaded grid config
					};

					let columns = (platformGridAPI.grids.exist(leadingGridUUID) && gridUUID !== leadingGridUUID) ? platformGridAPI.columns.getColumns(leadingGridUUID) : gridColumns;

					let uiService = {
						getStandardConfigForListView: () => {
							return {
								columns
							};
						}
					};
					basicsCommonDialogGridControllerService.initListController($scope, uiService, productionplanningCommonLoadSequenceDataService, {}, grid);

					gridTemplate += createGrid(gridData.label);

					const newContent = $compile(gridTemplate)($scope);
					// empty content
					$elem.html('');
					// then fill content
					$elem.append(newContent);

					if (gridUUID === leadingGridUUID) {
						// register onInitialized only for leading grid
						platformGridAPI.events.register(leadingGridUUID, 'onInitialized', onInitialized);
					}
					platformGridAPI.events.register(gridUUID, 'onCellChange', onCellChange);

					// todo: find a better solution after grid render done
					$timeout(() => {

						platformGridAPI.events.register(gridUUID, 'onSelectedRowsChanged', onRowChanged);
						platformGridAPI.rows.expandAllNodes(gridUUID);
						const grid = platformGridAPI.grids.element('id', gridUUID);
						if (grid.instance) {
							grid.instance.filterRowVisibility(false);
						}
					}, 500);

					// un-register on destroy
					$scope.$on('$destroy', function () {
						if (gridUUID === leadingGridUUID) {
							platformGridAPI.events.unregister(leadingGridUUID, 'onInitialized', onInitialized);
						}
						productionplanningCommonLoadSequenceDataService.removeSelectionByGrid(gridUUID);
						platformGridAPI.events.unregister(gridUUID, 'onCellChange', onCellChange);
						platformGridAPI.events.unregister(gridUUID, 'onSelectedRowsChanged', onRowChanged);
					});
				}

				return {
					restrict: 'A',
					scope: {
						ngModel: '=',
						sequence: '='
					},
					template: '',
					controller: controller,
					link: linkFn
				};
			}
		]
	);
})();
