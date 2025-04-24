/**
 * Created by uestuenel on 02.06.2016.
 */

(function (angular) {
	'use strict';

	//global declarations
	var toolbarItems = [];

	function basicsWorkflowUserTaskEditorDirective(basicsWorkflowActionEditorService, platformGridAPI, platformCreateUuid,
		platformModalService, $timeout, basicsWorkflowUserInputItemTypes,
		platformManualGridService, $translate, platformRuntimeDataService) {
		var manualGridService = platformManualGridService;

		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/user-task-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						toolbarItems.length = 0;

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						//accordion
						$scope.inputOpen = true;

						//init isPopUp checkbox
						$scope.isPopUpOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.isPopUpTooltipCaption')
						};

						$scope.isNotificationOptions = {
							ctrlId: 'isNotificationCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isNotification'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.isNotification'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.isNotificationTooltipCaption')
						};

						$scope.EvaluateProxyOptions = {
							ctrlId: 'EvaluateProxyCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.EvaluateProxyTooltipCaption')
						};

						$scope.DisableRefreshOptions = {
							ctrlId: 'DisableRefreshCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.DisableRefresh'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.DisableRefresh'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.DisableRefreshTooltipCaption'),
							showAllowReassign: false
						};

						$scope.AllowReassignOptions = {
							ctrlId: 'AllowReassignCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.AllowReassignRefreshTooltipCaption'),
							showAllowReassign: false
						};

						//init grid
						$scope.gridId = platformCreateUuid();

						$scope.gridData = {
							state: $scope.gridId
						};

						if (!platformGridAPI.grids.exist($scope.gridId)) {
							var grid = {
								columns: [
									{
										id: 'controlicon',
										field: 'controlicon',
										name: 'Structure',
										formatter: 'imageselect',
										formatterOptions: {
											iconItem: {
												css: true,
												res: 'test',
												text: ''
											},
											dataServiceMethod: function (entity, options) {
												if (options.iconItem.css) {
													var type = basicsWorkflowUserInputItemTypes[entity.type];
													options.iconItem.res = 'icon-parameter control-icons ' + (_.isUndefined(type) ? '' : type.icon);
												}

												return options.iconItem;
											}
										},
										width: 70,
										readony: $scope.codeMirrorOptions.readOnly
									},
									{
										id: 'description',
										field: 'description',
										name: 'Description',
										editor: $scope.codeMirrorOptions.readOnly ? null : 'description',
										width: 150,
										readony: $scope.codeMirrorOptions.readOnly
									},
									{
										id: 'type',
										field: 'type',
										name: 'Type',
										readOnly: true,
										width: 100,
										readony: $scope.codeMirrorOptions.readOnly
									},
									{
										id: 'context',
										field: 'context',
										name: 'Result',
										editor: $scope.codeMirrorOptions.readOnly ? null : 'description',
										width: 130,
										readony: $scope.codeMirrorOptions.readOnly
									},
									{
										id: 'visibleCondition',
										field: 'visibleCondition',
										name: 'Visible Condition',
										editor: 'comment',
										width: 130,
										readony: $scope.codeMirrorOptions.readOnly
									},
									{
										id: 'showDescriptionInFrontAsLabel',
										field: 'showDescriptionInFrontAsLabel',
										name: 'Show Description Ahead',
										formatter: 'dynamic',
										editor: 'dynamic',
										domain: function (item) {
											var domain = 'description';

											if (item.type === 'title' || item.type === 'subtitle') {
												platformRuntimeDataService.readonly(item, [{
													field: 'showDescriptionInFrontAsLabel',
													readonly: true
												}]);
											} else {
												domain = 'boolean';
											}
											return domain;
										},
										width: 140,
										readony: $scope.codeMirrorOptions.readOnly
									},
								],
								data: [],
								id: $scope.gridId,
								options: {
									tree: false,
									indicator: true,
									idProperty: 'id'
								}
							};

							platformGridAPI.grids.config(grid);
						}

						// register events
						platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
						platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChanged);

						//grid resize after splitter is moving
						var splitter = iElement.closest('.k-splitter').data('kendoSplitter');
						splitter.bind('resize', onResize);

						function onResize() {
							platformGridAPI.grids.resize($scope.gridId);
						}

						function addNewRowInGrid(type) {
							if (platformGridAPI) {
								var typeItem = basicsWorkflowUserInputItemTypes[type];

								if (typeItem) {
									var rowItem = {
										id: _.uniqueId(),
										controlicon: 'icon-parameter control-icons ' + typeItem.icon,
										context: null,
										description: '',
										type: type,
										options: typeItem.options,
										visibleCondition: '',
										showDescriptionInFrontAsLabel: false
									};

									manualGridService.addNewRowInGrid($scope.gridId, rowItem);
								}
							}
						}

						// add items to toolbar
						toolbarItems.push(
							{
								caption: 'Control Items',
								type: 'sublist',
								list: {
									showTitles: true,
									items: [
										{
											id: 'group1',
											caption: 'basics.workflow.toolbar.insertNumberElements',
											type: 'dropdown-btn',
											iconClass: 'control-icons ico-number',
											disabled: function () {
												return $scope.codeMirrorOptions.readOnly;
											},
											list: {
												showImages: true,
												items: [
													{
														id: 'g1-1',
														type: 'item',
														caption: 'platform.inputControls.money',
														fn: function () {
															addNewRowInGrid('money');
														}
													},
													{
														id: 'g1-2',
														type: 'item',
														caption: 'platform.inputControls.integer',
														fn: function () {
															addNewRowInGrid('integer');
														}
													},
													{
														id: 'g1-3',
														type: 'item',
														caption: 'platform.inputControls.quantity',
														fn: function () {
															addNewRowInGrid('quantity');
														}
													},
													{
														id: 'g1-6',
														type: 'item',
														caption: 'platform.inputControls.exchangerate',
														fn: function () {
															addNewRowInGrid('exchangerate');
														}
													},
													{
														id: 'g1-5',
														type: 'item',
														caption: 'platform.inputControls.factor',
														fn: function () {
															addNewRowInGrid('factor');
														}
													},
													{
														id: 'g1-4',
														type: 'item',
														caption: 'platform.inputControls.percent',
														fn: function () {
															addNewRowInGrid('percent');
														}
													},
													{
														id: 'g1-7',
														type: 'item',
														caption: 'platform.inputControls.code',
														fn: function () {
															addNewRowInGrid('code');
														}
													},
													{
														id: 'g1-8',
														type: 'item',
														caption: 'platform.inputControls.dateutc',
														fn: function () {
															addNewRowInGrid('dateutc');
														}
													}
												]
											}
										},
										{
											id: 'group2',
											caption: 'basics.workflow.toolbar.insertTextElements',
											type: 'dropdown-btn',
											iconClass: 'control-icons ico-text',
											disabled: function () {
												return $scope.codeMirrorOptions.readOnly;
											},
											list: {
												showImages: true,
												items: [
													{
														id: 'g2-1',
														type: 'item',
														caption: 'platform.inputControls.description',
														fn: function () {
															addNewRowInGrid('description');
														}
													},
													{
														id: 'g2-3',
														type: 'item',
														caption: 'platform.inputControls.remark',
														fn: function () {
															addNewRowInGrid('remark');
														}
													},
													{
														id: 'g2-4',
														type: 'item',
														caption: 'platform.inputControls.comment',
														fn: function () {
															addNewRowInGrid('comment');
														}
													},
													{
														id: 'g2-2',
														type: 'item',
														caption: 'platform.inputControls.email',
														fn: function () {
															addNewRowInGrid('email');
														}
													},
													{
														id: 'g2-3',
														type: 'item',
														caption: 'basics.workflow.action.customEditor.commentBox',
														fn: function () {
															addNewRowInGrid('commentBox');
														}
													}
												]
											}
										},
										{
											id: 'group3',
											caption: 'basics.workflow.toolbar.insertSelectElements',
											type: 'dropdown-btn',
											iconClass: 'control-icons ico-ctrl-combo',
											disabled: function () {
												return $scope.codeMirrorOptions.readOnly;
											},
											list: {
												showImages: true,
												items: [
													{
														id: 'g3-2',
														type: 'item',
														caption: 'platform.inputControls.select',
														fn: function () {
															addNewRowInGrid('select');
														}
													},
													{
														id: 'g3-3',
														type: 'item',
														caption: 'platform.inputControls.boolean',
														fn: function () {
															addNewRowInGrid('boolean');
														}
													},
													{
														id: 'g3-4',
														type: 'item',
														caption: 'basics.workflow.modalDialogs.clerkLookup',
														fn: function () {
															addNewRowInGrid('clerkLookup');
														}
													},
													{
														id: 'g3-5',
														type: 'item',
														caption: 'basics.workflow.modalDialogs.uploadDocuments',
														fn: function () {
															addNewRowInGrid('uploadDocuments');
														}
													},
													{
														id: 'g3-7',
														type: 'item',
														caption: 'basics.workflow.modalDialogs.materialLookup',
														fn: function () {
															addNewRowInGrid('materialLookup');
														}
													}
												]
											}
										},
										{
											id: 'group5',
											caption: 'basics.workflow.toolbar.insertDesignElements',
											type: 'dropdown-btn',
											iconClass: 'control-icons ico-ctrl-divider',
											disabled: function () {
												return $scope.codeMirrorOptions.readOnly;
											},
											list: {
												showImages: true,
												items: [
													{
														id: 'g5-1',
														type: 'item',
														caption: 'basics.workflow.controls.space',
														fn: function () {
															addNewRowInGrid('space');
														}
													},
													{
														id: 'g5-2',
														type: 'item',
														caption: 'basics.workflow.controls.divider',
														fn: function () {
															addNewRowInGrid('divider');
														}
													},
													{
														id: 'g5-3',
														type: 'item',
														caption: 'basics.workflow.controls.label',
														fn: function () {
															addNewRowInGrid('label');
														}
													}
												]
											}
										},
										{
											id: 'group4',
											caption: 'basics.workflow.toolbar.insertLinkElements',
											type: 'dropdown-btn',
											iconClass: 'control-icons ico-linkto',
											disabled: function () {
												return $scope.codeMirrorOptions.readOnly;
											},
											list: {
												showImages: true,
												items: [
													{
														id: 'g4-6',
														type: 'item',
														caption: 'basics.workflow.controls.linkToUrl',
														fn: function () {
															addNewRowInGrid('link');
														}
													},
													{
														id: 'g4-2',
														type: 'item',
														caption: 'basics.workflow.controls.linkToDocument',
														fn: function () {
															addNewRowInGrid('documentButton');
														}
													},
													{
														id: 'g4-3',
														type: 'item',
														caption: 'basics.workflow.controls.linkToEntity',
														fn: function () {
															addNewRowInGrid('entityLink');
														}
													},
													{
														id: 'g4-4',
														type: 'item',
														caption: 'basics.workflow.controls.linkToWizard',
														fn: function () {
															addNewRowInGrid('wizardButton');
														}
													},
													{
														id: 'g4-6',
														type: 'item',
														caption: 'basics.workflow.controls.linkToWorkflow',
														fn: function () {
															addNewRowInGrid('workflowButton');
														}
													},
													{
														id: 'g4-5',
														type: 'item',
														caption: 'basics.workflow.controls.linkToReport',
														fn: function () {
															addNewRowInGrid('reportButton');
														}
													},
													{
														id: 'g4-7',
														type: 'item',
														caption: 'basics.workflow.controls.linkToPinboard',
														fn: function () {
															addNewRowInGrid('pinboardButton');
														}
													}
												]
											}
										}
									]
								}
							},
							{
								id: 't3',
								caption: 'basics.workflow.toolbar.editOptions',
								type: 'item',
								iconClass: 'tlb-icons ico-pencil',
								disabled: function () {
									if ($scope.codeMirrorOptions.readOnly) {
										return true;
									}
									var element = platformGridAPI.grids.element('id', $scope.gridId);
									if (element) {
										var grid = element.instance;
										var selected = grid.getDataItem(grid.getSelectedRows());

										if (angular.isDefined(selected)) {
											var inputItemType = basicsWorkflowUserInputItemTypes[selected.type];

											if (inputItemType && inputItemType.dialogParams) {
												return false;
											}
										}

										return true;
									}
									return false;
								},
								fn: function () {
									var selection = platformGridAPI.rows.selection({gridId: $scope.gridId});
									var actionType = selection.type;

									var dialogParams = basicsWorkflowUserInputItemTypes[actionType].dialogParams;
									if (dialogParams) {
										var modalOptions = {
											headerTextKey: dialogParams.header,
											showOkButton: true,
											showCancelButton: true,
											value: _.clone(selection.options),
											bodyFlexColumn: dialogParams.bodyFlexColumn
										};

										if (dialogParams.bodyTemplate) {
											modalOptions.bodyTemplateUrl = globals.appBaseUrl + dialogParams.bodyTemplate;
										} else if (dialogParams.template) {
											modalOptions.templateUrl = globals.appBaseUrl + dialogParams.template;
										}

										platformModalService.showDialog(modalOptions).then(
											function (result) {
												if (result.ok) {
													selection.options = result.value;
													updateControlView();
												}
											}
										);
									}
								}
							},
							{
								id: 't4',
								caption: 'cloud.common.toolbarDelete',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								disabled: function () {
									if ($scope.codeMirrorOptions.readOnly) {
										return true;
									}
									return manualGridService.isDeleteBtnDisabled($scope.gridId, function (selected) {
										return !(angular.isDefined(selected) && selected.length > 0) || selected[0].type === 'userDecision' || selected[0].type === 'title' || selected[0].type === 'subtitle';
									});
								},
								fn: function () {
									manualGridService.deleteSelectedRow($scope.gridId, true);
								}
							},
							{
								caption: 'Move Buttons',
								type: 'sublist',
								list: {
									showTitles: true,
									items: [
										{
											id: 't5',
											caption: 'cloud.common.toolbarMoveUp',
											type: 'item',
											iconClass: 'tlb-icons ico-grid-row-up',
											disabled: function () {
												if ($scope.codeMirrorOptions.readOnly) {
													return true;
												}
												return manualGridService.isMoveBtnDisabled($scope.gridId, 'up');
											},
											fn: function () {
												manualGridService.moveRowInGrid($scope.gridId, 'up');
											}
										},
										{
											id: 't6',
											caption: 'cloud.common.toolbarMoveDown',
											type: 'item',
											iconClass: 'tlb-icons ico-grid-row-down',
											disabled: function () {
												if ($scope.codeMirrorOptions.readOnly) {
													return true;
												}
												return manualGridService.isMoveBtnDisabled($scope.gridId, 'down');
											},
											fn: function () {
												manualGridService.moveRowInGrid($scope.gridId, 'down');
											}
										}
									]
								}
							}
						);

						updateToolbar();

						ngModelCtrl.$formatters.push(function (value) {
							if (value) {
								action = value;
								var param = _.find(value.input, {key: 'Config'});

								var configAsObject = (param && param.value.trim()) ? angular.fromJson(param.value) : '';

								var gridData = toGridDataFormat(configAsObject);

								//return gridData ? gridData : '';

								var param2 = _.find(value.input, {key: 'IsPopUp'});
								var param3 = _.find(value.input, {key: 'IsNotification'});
								var param4 = _.find(value.input, {key: 'EvaluateProxy'});
								var param5 = _.find(value.input, {key: 'DisableRefresh'});
								var param6 = _.find(value.input, {key: 'AllowReassign'});

								$scope.DisableRefreshOptions.showAllowReassign = param5 !== undefined;
								$scope.AllowReassignOptions.showAllowReassign = param6 !== undefined;

								return {
									IsPopUp: param2 ? stringAsBoolean(param2.value) : false,
									IsNotification: param3 ? stringAsBoolean(param3.value) : false,
									EvaluateProxy: param4 ? stringAsBoolean(param4.value) : false,
									DisableRefresh: param5 ? stringAsBoolean(param5.value) : false,
									AllowReassign: param6 ? stringAsBoolean(param6.value) : false,
									gridData: gridData
								};

							}
						});

						function stringAsBoolean(val) {
							return val === true || _.isString(val) ? _.toLower(val) === 'true' : false;
						}

						function updateToolbar(ms) {
							if (_.isUndefined(ms)) {
								ms = 0;
							}

							$timeout(function () {
								$scope.tools.update();
							}, ms);
						}

						function toGridDataFormat(values) {
							//we need additionally a id in object
							for (var i = 0; i < values.length; i++) {
								if (values[i]) {
									var _split = values[i];
									_split.id = i;
								}
							}
							return values;
						}

						ngModelCtrl.$render = function () {
							platformGridAPI.items.data($scope.gridId, _.isArray(ngModelCtrl.$viewValue.gridData) ? ngModelCtrl.$viewValue.gridData : []);

							//isPopUp checkbox
							$scope.IsPopUp = ngModelCtrl.$viewValue.IsPopUp;

							//isNotification checkbox
							$scope.IsNotification = ngModelCtrl.$viewValue.IsNotification;

							//EvaluateProxy checkbox
							$scope.EvaluateProxy = ngModelCtrl.$viewValue.EvaluateProxy;

							//DisableRefresh checkbox
							$scope.DisableRefresh = ngModelCtrl.$viewValue.DisableRefresh;

							//Reassign checkbox
							$scope.AllowReassign = ngModelCtrl.$viewValue.AllowReassign;
						};

						function onSelectedRowsChanged() {
							updateControlView();
							updateToolbar();
						}

						function onCellChanged() {
							updateControlView();
						}

						function setViewValue(gridItems) {

							// push only needed columns
							var items = [];
							_.forEach(gridItems, function (value) {
								var item = {
									description: value.description,
									type: value.type,
									context: value.context,
									options: value.options,
									visibleCondition: value.visibleCondition,
									showDescriptionInFrontAsLabel: value.showDescriptionInFrontAsLabel
								};
								items.push(item);
							});

							var gridContent = angular.toJson(items);
							ngModelCtrl.$setViewValue(
								{
									Config: gridContent,
									IsPopUp: $scope.IsPopUp,
									IsNotification: $scope.IsNotification,
									EvaluateProxy: $scope.EvaluateProxy,
									DisableRefresh: $scope.DisableRefresh,
									AllowReassign: $scope.AllowReassign
								});
						}

						function updateControlView() {
							//
							setViewValue(platformGridAPI.items.data($scope.gridId));
						}

						ngModelCtrl.$parsers.push(function (value) {
							var param = _.find(action.input, {key: 'Config'});
							if (!param) {
								if (!action.input) {
									action.input = [];
								}
								action.input.push({key: 'Config', value: value});
							} else {
								param.value = value.Config;
							}

							// isPopUp Checkbox
							basicsWorkflowActionEditorService.setEditorInput(value.IsPopUp, 'IsPopUp', action);

							// isNotification Checkbox
							basicsWorkflowActionEditorService.setEditorInput(value.IsNotification, 'IsNotification', action);

							// EvaluateProxy Checkbox
							basicsWorkflowActionEditorService.setEditorInput(value.EvaluateProxy, 'EvaluateProxy', action);

							// DisableRefresh Checkbox
							basicsWorkflowActionEditorService.setEditorInput(value.DisableRefresh, 'DisableRefresh', action);

							// AllowReassign Checkbox
							basicsWorkflowActionEditorService.setEditorInput(value.AllowReassign, 'AllowReassign', action);

							return action;
						});

						//function for saving changes in checkbox
						$scope.changeCheckbox = function () {
							setViewValue(platformGridAPI.items.data($scope.gridId));
						};

						$scope.$on('$destroy', function () {
							platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
							platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChanged);
							platformGridAPI.grids.unregister($scope.gridId);
							if (splitter) {
								splitter.unbind('resize', onResize);
								splitter = null;
							}
						});
					}
				};
			}
		};
	}

	basicsWorkflowUserTaskEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', 'platformModalService', '$timeout', 'basicsWorkflowUserInputItemTypes',
		'platformManualGridService', '$translate', 'platformRuntimeDataService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowUserTaskEditorDirective', basicsWorkflowUserTaskEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '00000000000000000000000000000000',
					directive: 'basicsWorkflowUserTaskEditorDirective',
					prio: null,
					tools: toolbarItems
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '00000000000000000000000000000001',
					directive: 'basicsWorkflowUserTaskEditorDirective',
					prio: null,
					tools: toolbarItems
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '0000f7032fb24660ba278e52126249be',
					directive: 'basicsWorkflowUserTaskEditorDirective',
					prio: null,
					tools: toolbarItems
				}
			);

			/*			basicsWorkflowModuleOptions.actionEditors.push(
							{
								actionId: '00000CB98D9A4C87A6504C5313080EB9',
								directive: 'basicsWorkflowUserDecisionExEditorDirective',
								prio: null,
								tools: toolbarItems
							}
						);*/
		}]);

})(angular);
