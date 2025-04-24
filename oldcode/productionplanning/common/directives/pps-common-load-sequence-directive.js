/*
 * Created by mik on 04/10/2021.
 */

/* global globals, moment */

(function () {
	'use strict';

	const moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonLoadSequenceDirective',
		['_', '$', '$timeout', '$compile', '$injector', '$translate', '$http', 'platformGridAPI', 'productionplanningCommonLoadSequenceDataService',
			'platformModalFormConfigService', 'platformDialogService', 'productionplanningCommonLoadSequenceBulkDataService',
			'ppsCommonFieldSequenceUuidConstant', 'basicsLookupdataLookupControllerFactory', 'mainViewService', 'platformCreateUuid',
			function (_, $, $timeout, $compile, $injector, $translate, $http, platformGridAPI, productionplanningCommonLoadSequenceDataService,
				platformModalFormConfigService, platformDialogService, productionplanningCommonLoadSequenceBulkDataService,
				ppsCommonFieldSequenceUuidConstant, basicsLookupdataLookupControllerFactory, mainViewService, platformCreateUuid) {
				let gridUUIDs = new Map();
				let elemRef = {};
				let scopeRef = {};
				let loadSequenceDayCount = 0;
				let loadingSpinner = {};
				const leadingGridUUID = ppsCommonFieldSequenceUuidConstant.leadingGridUUID;

				const loadSequenceTools = [
					{
						id: 'setInitialData',
						type: 'item',
						caption: '*Refresh',
						sort: 1,
						iconClass: 'tlb-icons ico-reset',
						fn: () => {
							productionplanningCommonLoadSequenceDataService.calculateLoadSequence(false);
							refreshGrids();
						}
					},
					{
						id: 'bulkEditor',
						type: 'item',
						caption: 'cloud.common.bulkEditor.title',
						sort: 2,
						iconClass: 'type-icons ico-construction51',
						fn: () => {
							let dialogOptions = {
								headerText$tr$: 'productionplanning.common.wizard.loadSequence.resequencePlan',
								bodyTemplate: '<div productionplanning-common-load-sequence-bulk-edit-directive style="width: 100%; height: 100%;"></div>',
								showCancelButton: true,
								showNoButton: false,
								showOkButton: true,
								height: '70%',
								width: '30%',
								resizeable: true,
								value: {
									defaultForm: null,
									selectedItem: null
								}
							};

							platformDialogService.showDialog(dialogOptions).then((result) => {
								if (result.ok) {
									let manipulatedProducts = productionplanningCommonLoadSequenceBulkDataService.getList();
									productionplanningCommonLoadSequenceDataService.refreshManipulatedData(manipulatedProducts);
									setTimeout(() => {
										refreshGrids();
									}, 300);
								}
							});
						}
					},
					{
						id: 'fieldSequenceSettingsDopdown',
						caption: 'cloud.common.toolbarSetting',
						sort: 3,
						type: 'dropdown-btn',
						icoClass: 'tlb-icons ico-settings',
						cssClass: 'tlb-icons ico-settings',
						list: {
							items: [
								{
									id: 'fieldSequenceSettings',
									//iconClass: 'tlb-icons ico-settings',
									caption: 'productionplanning.common.wizard.loadSequence.loadSequenceSettings',
									sort: 1,
									type: 'item',
									fn: function () {
										let dialogConfig = {
											title: '*Field Sequence Options',// 'platform.planningboard.configDialog',
											dataItem: {
												initialOptions: productionplanningCommonLoadSequenceDataService.options
											},
											formConfiguration: {
												fid: 'createSequence',
												version: '1.0.0',
												showGrouping: false,
												skipPermissionsCheck: true,
												groups: [{
													gid: 'default'
												}],
												rows: [
													{
														gid: 'default',
														rid: 'startDate',
														type: 'date',
														model: 'initialOptions.startDate',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.startDate'),
														visible: true,
														sortOrder: 1,
														required: true,
														readonly: true
													},
													{
														gid: 'default',
														rid: 'dailyStartTime',
														type: 'timeutc',
														model: 'initialOptions.dailyStartTime',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.dailyStartTime'),
														visible: true,
														sortOrder: 2,
														required: true
													},
													{
														gid: 'default',
														rid: 'projectStretchRate',
														type: 'integer',
														model: 'initialOptions.projectStretchRate',
														placeholder: '0',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.projectStretchRate'),
														visible: true,
														sortOrder: 3,
														readonly: true
													},
													{
														gid: 'default',
														rid: 'stretchRateFactor',
														type: 'percent',
														model: 'initialOptions.stretchRateFactor',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.stretchRateFactor'),
														visible: true,
														sortOrder: 4,
														change: function (model) {
															model.initialOptions.stretchRate = model.initialOptions.projectStretchRate + (model.initialOptions.projectStretchRate * (model.initialOptions.stretchRateFactor / 100));
														}
													},
													{
														gid: 'default',
														rid: 'stretchRate',
														type: 'integer',
														model: 'initialOptions.stretchRate',
														placeholder: '0',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.stretchRate'),
														visible: true,
														sortOrder: 5,
														required: true,
														change: function (model) {
															model.initialOptions.stretchRateFactor = ((model.initialOptions.stretchRate - model.initialOptions.projectStretchRate) / model.initialOptions.projectStretchRate) * 100;
															okButtonDisabled = model.initialOptions.stretchRate <= 0; // stretch rate must be bigger than 0!
														},
														validator: function (model, value) {
															return {
																valid: value > 0,
																apply: true,
																error: 'Stretch Rate must be bigger than 0!',
																error$tr$: 'productionplanning.common.wizard.loadSequence.errorMsg.stretchRateZeroError'
															};
														},
													},
													{
														gid: 'default',
														rid: 'maxWeight',
														type: 'integer',
														model: 'initialOptions.maxWeight',
														placeholder: '0',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.maxWeightPerTransport'),
														visible: true,
														sortOrder: 6,
														required: true
													},
													{
														gid: 'default',
														rid: 'halfStretchRateFriday',
														type: 'boolean',
														model: 'initialOptions.halfStretchRateFriday',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.halfStretchRateFriday'),
														visible: true,
														sortOrder: 7
													},
													{
														gid: 'default',
														rid: 'maximizeLastLoad',
														type: 'boolean',
														model: 'initialOptions.maximizeLastLoad',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.maximizeLastLoad'),
														visible: true,
														sortOrder: 8
													},
													{
														gid: 'default',
														rid: 'plannedStretchRate',
														type: 'integer',
														model: 'initialOptions.plannedStretchRate',
														placeholder: '0',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.plannedStretchRate'),
														visible: true,
														sortOrder: 9,
														readonly: true
													},
												]
											},
											dialogOptions: {
												disableOkButton: function disableOkButton() {
													return okButtonDisabled;
												}
											},
											handleOK: function handleOK(result) {
												productionplanningCommonLoadSequenceDataService.setOptions(result.data.initialOptions);
												productionplanningCommonLoadSequenceDataService.setDefinedStretchRateOfLoadSequence();
												productionplanningCommonLoadSequenceDataService.calculateLoadSequence(false);
											},
											handleCancel: function handleCancel() {

											}
										};
										let okButtonDisabled = productionplanningCommonLoadSequenceDataService.options.stretchRate <= 0;
										platformModalFormConfigService.showDialog(dialogConfig);
									}
								},
								{
									id: 't111',
									sort: 111,
									caption: 'cloud.common.gridlayout',
									//iconClass: 'tlb-icons ico-settings',
									type: 'item',
									fn: function () {
										platformGridAPI.configuration.openConfigDialog(leadingGridUUID).then(() => {
											// render all grids after grid layout dialog is closed
											onLeadingGridInitialized(true);
										});
									}
								},
								{
									id: 'fieldSequenceSettings',
									//iconClass: 'tlb-icons ico-settings',
									caption: '*Grid Settings',
									caption$tr$: 'cloud.common.gridSettings',
									sort: 3,
									type: 'item',
									fn: function () {
										let dialogConfig = {
											title: '*Grid Settings',
											title$tr$: 'cloud.common.gridSettings',
											dataItem: {
												initialOptions: scopeRef.gridSettings
											},
											formConfiguration: {
												fid: 'createSequence',
												version: '1.0.0',
												showGrouping: true,
												skipPermissionsCheck: true,
												groups: [{
													gid: '1',
													header: 'General',
													header$tr$: 'platform.planningboard.general',
													isOpen: true,
													visible: true,
													sortOrder: 1
												}],
												rows: [
													{
														gid: '1',
														rid: 'projectStretchRate',
														type: 'integer',
														model: 'initialOptions.columnWidth',
														placeholder: '0',
														label: $translate.instant('productionplanning.common.wizard.loadSequence.columnWidth'),
														visible: true,
														sortOrder: 1,
														readonly: false
													}
												]
											},
											dialogOptions: {
												disableOkButton: function disableOkButton() {
													return false;
												}
											},
											handleOK: function handleOK(result) {
												scopeRef.gridSettings = result.data.initialOptions;
												saveGridSettings();
												$timeout(() => {
													// renderGrids(productionplanningCommonLoadSequenceDataService.getLoadSequence(), true);
													gridUUIDs.forEach(platformGridAPI.grids.resize);
												}, 50);
											},
											handleCancel: function handleCancel() {
												scopeRef.gridSettings = currentGridSettings;
											}
										};
										let currentGridSettings = _.clone(scopeRef.gridSettings);
										platformModalFormConfigService.showDialog(dialogConfig);
									}
								},
							]
						}
					}
				];

				function createLoadSequenceTemplate(grids) {
					return '<div style="margin-bottom: 5px;" data-ng-if="gridSettings.showInfoFields">' +
						'<span data-ng-repeat="field in fieldSequenceInfoFields | filter:{active: true}">{{field.name}}: {{field.value}} | </span></div>' +
						'<div class="subview-header toolbar flex-box flex-row flex-element">' +
						'<h3 class="font-bold title fix">' + $translate.instant('productionplanning.common.wizard.loadSequence.editLoads') + '</h3>' +
						'<div data-platform-menu-list data-list="tools"></div>' +
						'</div>' +
						'<div style="position: relative; height: 47vh; overflow-x: scroll;">' +
						'<div style="position: absolute;">' +
						'<div id="ppsLoadSequenceContainer" style="width: 100%;" class="flex-box flex-row subview-content relative-container" style="display: flex; flex-wrap: wrap; overflow: auto;">' +
						grids +
						'</div>' +
						'</div>' +
						'</div>' +
						'<div class="platform-form style="width: 100%">' +
						'<div class="platform-form-row">' +
						'<div style="padding-right: 20px" data-domain-control data-domain="boolean" data-ng-model="mobilizedDataData.mobilizedDataChanged" data-readonly="mobilizedDataData.changeSystemTriggered" data-change="mobilizedDataData.canFinishCheck()"></div>' +
						'<label class="platform-form-label" data-model="">Inform Project Manager</label>' +
						'</div>' +
						'<div id="remarkBox" style="position: relative; height: 14vh; overflow-y: scroll;" class="form-control" data-domain-control data-domain="remark" data-ng-model="mobilizedDataData.mobilizedDataComment" data-placeholder="The comment is mandatory!" data-change="mobilizedDataData.canFinishCheck()" readonly="!mobilizedDataData.mobilizedDataChanged"></div>' +
						'</div>';
				}

				function canFinishCheck() {
					scopeRef.$parent.$parent.$parent.currentStep.canFinish = (scopeRef.mobilizedDataData.mobilizedDataChanged && scopeRef.mobilizedDataData.mobilizedDataComment.length > 0) || !scopeRef.mobilizedDataData.mobilizedDataChanged;
				}

				function createGridDirective(dataString) {
					return `<div productionplanning-common-load-sequence-grid-directive data-sequence="gridData.${dataString}" ng-style="{'flex-basis': gridSettings.columnWidth}" style="height: 100%; display: flex; flex-wrap: wrap; overflow: auto; margin-right: 10px; flex-grow: 0; flex-shrink: 0;"></div>`;
				}


				function refreshGrids() {
					productionplanningCommonLoadSequenceDataService.resetSelection();
					gridUUIDs.forEach((uuid, dayId) => {
						let loadByDay = productionplanningCommonLoadSequenceDataService.getLoadByDay(dayId);
						if (_.isNull(loadByDay)) {
							gridUUIDs.delete(dayId);
						} else {
							platformGridAPI.items.data(uuid, loadByDay);
							platformGridAPI.grids.refresh(uuid);
						}
					});
				}

				function refreshGrid(dayId) {
					gridUUIDs.forEach((uuid, mappedDayId) => {
						if (mappedDayId === dayId) {
							platformGridAPI.items.data(uuid, productionplanningCommonLoadSequenceDataService.getLoadByDay(dayId));
							platformGridAPI.grids.refresh(uuid);
							platformGridAPI.rows.expandAllNodes(uuid);
						}
					});
				}

				// function addGrids(data) {
				// 	let lastGrid = elemRef.find('#ppsLoadSequenceContainer');
				// 	let gridTemplates = getGridTemplates(data);
				//
				// 	const newContent = $compile(gridTemplates)(scopeRef);
				// 	lastGrid.append(newContent);
				// }

				function getGridTemplates(data, skipLeading) {
					let gridTemplates = '';
					data.forEach((model, idx) => {
						console.log('model', model);
						let gridUUID = (skipLeading) ? platformCreateUuid() : leadingGridUUID;

						gridUUIDs.set(model.rowId, gridUUID);
						scopeRef.gridData[model.rowId] = {
							state: gridUUID,
							data: model
						};

						gridTemplates += createGridDirective(model.rowId);
					});

					return gridTemplates;
				}

				function onLeadingGridInitialized(renderAllGrids) {
					let loadSequence = productionplanningCommonLoadSequenceDataService.getLoadSequence();
					$timeout(() => {
						updateInfoFileds();
						renderGrids(loadSequence, renderAllGrids);
					}, 50);
				}

				function onLoadSequenceChanged(loadSequence) {
					$timeout(() => {
						updateInfoFileds();
						renderGrids(loadSequence);
					}, 50);

					// todo: add grid without flickering
					// if (loadSequence.length > gridUUIDs.size) {
					// 	// filter data: only new added days
					// 	let newDays = loadSequence.slice(gridUUIDs.size-loadSequence.length);
					// 	addGrids(newDays);
					// } else {
					// 	renderGrids(loadSequence);
					// }
					// $timeout(function () {
					// 	refreshGrids();
					// });
				}

				function onDataChanged(loadSequence) {
					$timeout(function () {
						updateInfoFileds();
						refreshGrids();
					});
					loadSequenceDayCount = loadSequence.length;
				}

				function onLoadCreated(dayId) {
					$timeout(function () {
						updateInfoFileds();
						refreshGrid(dayId);
					});
				}

				function renderGrids(data, isLeadingGrid = true) {
					// reinitialize grid settings here!
					applyGridSettings();

					let clonedData = _.clone(data);
					if (isLeadingGrid) {
						gridUUIDs.clear();
						let gridTemplates = getGridTemplates([clonedData[0]]);

						const loadSequenceTemplate = createLoadSequenceTemplate(gridTemplates);
						const newContent = $compile(loadSequenceTemplate)(scopeRef);
						// empty content
						elemRef.html('');
						// then fill content
						elemRef.append(newContent);
					} else {
						clonedData.shift(); // remove first array entry = leading grid data
						let gridTemplates = getGridTemplates(clonedData, true);

						const newContent = $compile(gridTemplates)(scopeRef);
						$('#ppsLoadSequenceContainer').append(newContent);
					}
				}

				function loadingSpinnerForWizard(activate) {
					if (activate) {
						loadingSpinner = angular.element('<div class="wait-overlay" style="display:none;"></div>');
						const box = angular.element('<div class="box"></div>').appendTo(loadingSpinner);
						box.append('<div class="spinner-lg"></div>');
						box.append('<span></span>');
						loadingSpinner.appendTo('.modal-body');
						loadingSpinner.show();
					} else {
						loadingSpinner.hide();
					}
				}

				function updateInfoFileds() {
					let basicInfoData = productionplanningCommonLoadSequenceDataService.getFieldSequenceInfos();

					let loadCount = 0;
					productionplanningCommonLoadSequenceDataService.getLoadSequence().forEach(d => loadCount+= d.loadCount);
					scopeRef.fieldSequenceInfoFields = [
						{
							name: 'Prj Name',
							value: basicInfoData.Project.ProjectName || '',
							active: scopeRef.gridSettings.showInfoFields
						},
						{
							name: 'Prj Nr',
							value: basicInfoData.Project.ProjectNo || '',
							active: scopeRef.gridSettings.showInfoFields
						},
						{
							name: 'Load count',
							value: loadCount,
							active: scopeRef.gridSettings.showInfoFields
						},
						{
							name: 'Max Pnl Weight',
							value: Math.max.apply(Math, productionplanningCommonLoadSequenceDataService.getProducts().map(function(p) { return p.weight; })),
							active: scopeRef.gridSettings.showInfoFields
						},
						{
							name: 'Avail. Cranes',
							value: 'A',
							active: scopeRef.gridSettings.showInfoFields
						}];

					if(basicInfoData.Project2Clerks.length > 0){
						basicInfoData.Project2Clerks.forEach((prj2clerk) => {
							scopeRef.fieldSequenceInfoFields.push({
								name: basicInfoData.Clerks2Roles.filter(role => role.Id === prj2clerk.ClerkRoleFk)[0].DescriptionInfo.Description,
								value: basicInfoData.Clerks.filter(clerk => clerk.Id === prj2clerk.ClerkFk) ? basicInfoData.Clerks.filter(clerk => clerk.Id === prj2clerk.ClerkFk)[0].Description : '',
								active: scopeRef.gridSettings.showInfoFields
							});
						});
					}
				}

				const controller = ['$scope', function ($scope) {
					productionplanningCommonLoadSequenceDataService.registerOnLoadSequenceChanged(onLoadSequenceChanged);
					productionplanningCommonLoadSequenceDataService.registerOnDataChanged(onDataChanged);
					productionplanningCommonLoadSequenceDataService.registerOnLoadCreated(onLoadCreated);
					productionplanningCommonLoadSequenceDataService.registerOnLoadSequenceFromDataCreated(loadingSpinnerForWizard);
					productionplanningCommonLoadSequenceDataService.registerOnMobilizedDataChangeSystemTriggered(canFinishCheck);
					productionplanningCommonLoadSequenceDataService.registerOnLeadingGridInitialized(onLeadingGridInitialized);
				}];

				// region Grid Settings

				function applyGridSettings() {
					const config = mainViewService.getModuleConfig(leadingGridUUID);
					if (_.has(config, 'CustomConfig.gridSettings')) {
						_.merge(scopeRef.gridSettings, config.CustomConfig.gridSettings);
					} else {
						scopeRef.gridSettings = productionplanningCommonLoadSequenceDataService.getDefaultGridSettings();
					}
				}

				function saveGridSettings() {
					if (_.isFunction(mainViewService.setModuleCustomConfig)) {
						mainViewService.setModuleCustomConfig(leadingGridUUID, {'gridSettings' : scopeRef.gridSettings}, 'gridSettings');
					}
				}

				// endregion

				// region Toolbar Initialization

				function initializeTools(scope) {
					initializeBaseTools(scope);
					completeToolbar(scope.tools.items);
				}

				function initializeBaseTools(scope) {
					const gridOptions = {
						treeOptions : {
							parentProp: true,
							childProp: true
						},
						gridId: leadingGridUUID
					};
					basicsLookupdataLookupControllerFactory.create({grid: true, dialog: true, search: false}, scope, gridOptions);
					// remove layout tool!
					_.remove(scope.tools.items, {id:'t111'});
				}

				function completeToolbar(toolItems) {
					// step1 get layout tools
					const toolsInLists = _.compact(toolItems.map((t) => t.list)).map(l => l.items).flat();
					const layoutLoadTools = _.filter(toolsInLists, (t) => { return t.id.includes('load'); });
					// step2: wrap tool function
					layoutLoadTools.forEach(wrapLayoutTool);
					// step3: add additional tools
					toolItems.push(...loadSequenceTools);
				}

				function wrapLayoutTool(tool) {
					const originalToolFunction = tool.fn;
					tool.fn = () => {
						originalToolFunction();
						onLeadingGridInitialized(true);
						// configuration refresh doesn't work the first time :(
						// gridUUIDs.forEach(platformGridAPI.configuration.refresh);
					};
				}

				// endregion

				function linkFn($scope, $elem) {
					loadingSpinnerForWizard(true);
					elemRef = $elem;
					scopeRef = $scope;
					$scope.grids = [];
					$scope.gridData = [];

					$scope.gridSettings = productionplanningCommonLoadSequenceDataService.getDefaultGridSettings();

					// intialize tools here!
					initializeTools($scope);
					// $scope.loadSequenceTools = loadSequenceTools;
					$scope.mobilizedDataData = productionplanningCommonLoadSequenceDataService.mobilizedDataData;
					$scope.mobilizedDataData.canFinishCheck = canFinishCheck;

					$scope.fieldSequenceInfoFields = [];

					// un-register on destroy
					$scope.$on('$destroy', function () {
						productionplanningCommonLoadSequenceDataService.unRegisterOnLoadSequenceChanged(onLoadSequenceChanged);
						productionplanningCommonLoadSequenceDataService.unRegisterOnDataChanged(onDataChanged);
						productionplanningCommonLoadSequenceDataService.unRegisterOnLoadCreated(onLoadCreated);
						productionplanningCommonLoadSequenceDataService.unRegisterOnLoadSequenceFromDataCreated(loadingSpinnerForWizard);
						productionplanningCommonLoadSequenceDataService.unRegisterOnMobilizedDataChangeSystemTriggered(canFinishCheck);
						productionplanningCommonLoadSequenceDataService.unRegisterOnLeadingGridInitialized(onLeadingGridInitialized);
						// elemRef = null;
						// scopeRef = null;
					});
				}

				return {
					restrict: 'A',
					scope: {
						ngModel: '=',
						options: '='
					},
					template: '',
					controller: controller,
					link: linkFn
				};
			}
		]
	);
})();
