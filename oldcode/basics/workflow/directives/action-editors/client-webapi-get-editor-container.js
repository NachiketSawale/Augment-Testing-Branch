/**
 * Created by uestuenel on 10.06.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowClientWebApiGetEditorContainer(basicsWorkflowActionEditorService, platformCreateUuid,
	                                                      platformGridAPI, basicsWorkflowEditModes, $translate, $timeout, basicsWorkflowGlobalContextUtil) {

		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/client-webapi-get-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.input = {};
						$scope.input.editorMode = basicsWorkflowEditModes.default;
						$scope.input.editorModeHeader = basicsWorkflowEditModes.default;
						$scope.input.radioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
									cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
							$scope.input[model] = parseInt(radioValue);

							$timeout(function () {
								platformGridAPI.grids.resize($scope.gridId);
								platformGridAPI.grids.resize($scope.gridIdHeaders);
							}, 0);
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						$scope.gridId = platformCreateUuid();

						$scope.gridData = {
							state: $scope.gridId
						};

						if (!platformGridAPI.grids.exist($scope.gridId)) {
							var grid = {
								columns: [
									{
										id: 'key',
										field: 'key',
										name: 'Key',
										formatter: 'remark',
										editor: 'directive',
										editorOptions: {
											directive: 'basics-workflow-grid-script-editor-directive',
											lineNumbers: false,
											lint: false,
											showHint: false,
											fixedGutter: false,
											gutters: [],
											hintOptions: {
												get globalScope() {
													return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
												}
											}
										},
										sortable: true,
										keyboard: {
											enter: true
										},
										width: 100
									},
									{
										id: 'value',
										field: 'value',
										name: 'Value',
										formatter: 'remark',
										editor: 'directive',
										editorOptions: {
											directive: 'basics-workflow-grid-script-editor-directive',
											lineNumbers: false,
											lint: false,
											showHint: false,
											fixedGutter: false,
											gutters: [],
											hintOptions: {
												get globalScope() {
													return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
												}
											}
										},
										sortable: true,
										keyboard: {
											enter: true
										},
										width: 150
									}
								],
								data: [],
								id: $scope.gridId,
								options: {
									tree: false,
									indicator: true,
									idProperty: 'Id'
								}
							};
							platformGridAPI.grids.config(grid);
						}

						$scope.gridIdHeaders = platformCreateUuid();

						$scope.gridDataHeaders = {
							state: $scope.gridIdHeaders
						};

						if (!platformGridAPI.grids.exist($scope.gridIdHeaders)) {
							var gridConfigHeaders = {
								columns: [
									{
										id: 'key',
										field: 'key',
										name: 'Key',
										formatter: 'remark',
										editor: 'directive',
										editorOptions: {
											directive: 'basics-workflow-grid-script-editor-directive',
											lineNumbers: false,
											lint: false,
											showHint: false,
											fixedGutter: false,
											gutters: [],
											hintOptions: {
												get globalScope() {
													return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
												}
											}
										},
										sortable: true,
										keyboard: {
											enter: true
										},
										width: 100
									},
									{
										id: 'value',
										field: 'value',
										name: 'Value',
										formatter: 'remark',
										editor: 'directive',
										editorOptions: {
											directive: 'basics-workflow-grid-script-editor-directive',
											lineNumbers: false,
											lint: false,
											showHint: false,
											fixedGutter: false,
											gutters: [],
											hintOptions: {
												get globalScope() {
													return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
												}
											}
										},
										sortable: true,
										keyboard: {
											enter: true
										},
										width: 150
									}
								],
								data: [],
								id: $scope.gridIdHeaders,
								options: {
									tree: false,
									indicator: true,
									idProperty: 'Id'
								}
							};
							platformGridAPI.grids.config(gridConfigHeaders);
						}

						platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						platformGridAPI.events.register($scope.gridIdHeaders, 'onSelectedRowsChanged', onChangeGridContentHeaders);
						platformGridAPI.events.register($scope.gridId, 'onCellChange', onChangeGridContent);
						platformGridAPI.events.register($scope.gridIdHeaders, 'onCellChange', onChangeGridContentHeaders);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Data', action);
								var gridContentParams = setGridItemsData(value.input, 'Params', ['Id', 'Key', 'Value']);
								var gridContentHeaders = setGridItemsData(value.input, 'Headers', ['Id', 'Key', 'Value']);

								//content for codemirror
								var param = _.find(value.input, {Key: 'WebApiURL'});
								var webApiURL = param ? param.value : '';

								return {
									gridContentParams: gridContentParams,
									gridContentHeaders: gridContentHeaders,
									webApiURL: webApiURL,
									outputValue: outputProperty ? outputProperty.Value : ''
								};
							}
							return '';
						});

						function setGridItemsData(valueInput, keyName, gridColumns) {
							var actionInputItem = _.find(valueInput, {key: keyName});
							var gridContent;
							if (actionInputItem && actionInputItem.value) {
								gridContent = basicsWorkflowActionEditorService.getGridDataFormat(actionInputItem.value.trim().split(';'), gridColumns);
							}
							return gridContent;
						}

						ngModelCtrl.$render = function () {
							$scope.input.script = ngModelCtrl.$viewValue.webApiURL;
							platformGridAPI.items.data($scope.gridId, ngModelCtrl.$viewValue.gridContentParams ? ngModelCtrl.$viewValue.gridContentParams : []);
							platformGridAPI.items.data($scope.gridIdHeaders, ngModelCtrl.$viewValue.gridContentHeaders ? ngModelCtrl.$viewValue.gridContentHeaders : []);

							$scope.input.paramscript = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.gridContentParams);
							$scope.input.headerscript = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.gridContentHeaders);

							$scope.output.clientGet = ngModelCtrl.$viewValue.outputValue;
						};

						var param = '';

						function onChangeGridContent() {
							param = 'gridParam';
							ngModelCtrl.$setViewValue({
								gridContentParams: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridId))
							});
						}

						function onChangeGridContentHeaders() {
							param = 'gridHeaders';
							ngModelCtrl.$setViewValue({
								gridContentHeaders: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridIdHeaders))
							});
						}

						ngModelCtrl.$parsers.push(function (value) {
							if (param === 'gridParam') {
								basicsWorkflowActionEditorService.setEditorInput(value.gridContentParams, 'Params', action);
							} else if (param === 'gridHeaders') {
								basicsWorkflowActionEditorService.setEditorInput(value.gridContentHeaders, 'Headers', action);
							} else {
								basicsWorkflowActionEditorService.setEditorInput(value.webApiURL, 'WebApiURL', action);
								basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Data', action);
								basicsWorkflowActionEditorService.setEditorInput(value.gridContentParams, 'Params', action);
								basicsWorkflowActionEditorService.setEditorInput(value.gridContentHeaders, 'Headers', action);
							}

							return action;
						});

						function saveNgModel() {
							var gridContentParams = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridId));
							if ($scope.input.editorMode === 2) {
								gridContentParams = $scope.input.paramscript;
							}

							var gridContentHeaders = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridIdHeaders));
							if ($scope.input.editorModeHeader === 2) {
								gridContentHeaders = $scope.input.headerscript;
							}

							ngModelCtrl.$setViewValue({
								gridContentParams: gridContentParams,
								gridContentHeaders: gridContentHeaders,
								webApiURL: $scope.input.script,
								scriptOutput: $scope.output.clientGet
							});
						}

						//changes in codemirror
						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						$scope.$watch('input.script', watchfn);
						$scope.$watch('output.clientGet', watchfn);
						$scope.$watch('input.headerscript', watchfn);
						$scope.$watch('input.paramscript', watchfn);

						$scope.tools = {
							showImages: true,
							showTitles: true,
							cssClass: 'tools',
							items: [{
								id: 'add',
								caption: 'cloud.common.toolbarInsert',
								iconClass: 'tlb-icons ico-rec-new',
								type: 'item',
								fn: function () {
									var rowItem = {
										id: -1,
										key: '',
										value: ''
									};

									platformGridAPI.rows.add({gridId: $scope.gridId, item: rowItem});
									platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, rowItem);
								}
							},
								{
									id: 'delete',
									caption: 'cloud.common.toolbarDelete',
									iconClass: 'tlb-icons ico-rec-delete',
									type: 'item',
									fn: function () {
										var selItem = platformGridAPI.rows.selection({gridId: $scope.gridId});

										platformGridAPI.rows.delete({
											gridId: $scope.gridId,
											item: selItem
										});

										platformGridAPI.grids.refresh($scope.gridId, true);
									}
								}],
							update: function () {
								this.version++;
							}
						};

						$scope.toolsHeaders = {
							showImages: true,
							showTitles: true,
							cssClass: 'tools',
							items: [{
								id: 'add',
								caption: 'cloud.common.toolbarInsert',
								iconClass: 'tlb-icons ico-rec-new',
								type: 'item',
								fn: function () {
									var rowItem = {
										id: -1,
										key: '',
										value: ''
									};

									platformGridAPI.rows.add({gridId: $scope.gridIdHeaders, item: rowItem});
									platformGridAPI.rows.scrollIntoViewByItem($scope.gridIdHeaders, rowItem);
								}
							},
								{
									id: 'delete',
									caption: 'cloud.common.toolbarDelete',
									iconClass: 'tlb-icons ico-rec-delete',
									type: 'item',
									fn: function () {
										var selItem = platformGridAPI.rows.selection({gridId: $scope.gridIdHeaders});

										platformGridAPI.rows.delete({
											gridId: $scope.gridIdHeaders,
											item: selItem
										});

										platformGridAPI.grids.refresh($scope.gridIdHeaders, true);
									}
								}],
							update: function () {
								this.version++;
							}
						};

						$scope.$on('$destroy', function () {
							platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
							platformGridAPI.events.unregister($scope.gridIdHeaders, 'onSelectedRowsChanged', onChangeGridContentHeaders);
							platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onChangeGridContent);
							platformGridAPI.events.unregister($scope.gridIdHeaders, 'onCellChange', onChangeGridContentHeaders);
							platformGridAPI.grids.unregister($scope.gridId);
							platformGridAPI.grids.unregister($scope.gridIdHeaders);
						});
					}
				};
			}
		};
	}

	basicsWorkflowClientWebApiGetEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformCreateUuid',
		'platformGridAPI', 'basicsWorkflowEditModes', '$translate', '$timeout', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowClientWebApiGetEditorContainer', basicsWorkflowClientWebApiGetEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '2de0f47cad6045a6849c029a31a38617',
				directive: 'basicsWorkflowClientWebApiGetEditorContainer',
				prio: null,
				tools: []
			});
		}]);

})(angular);
