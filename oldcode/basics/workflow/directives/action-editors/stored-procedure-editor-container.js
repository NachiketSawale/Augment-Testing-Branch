/**
 * Created by uestuenel on 12.05.2016.
 */

(function (angular) {
	'use strict';

	function storedProcedureDatasetActionEditorDirective(basicsWorkflowActionEditorService, platformCreateUuid,
	                                                     platformGridAPI, basicsWorkflowGlobalContextUtil,
	                                                     basicsWorkflowEditModes, $translate, $timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/stored-procedure-action-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						var param = '';
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						//radio-button
						$scope.input = {};
						$scope.input.editorMode = basicsWorkflowEditModes.default;
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

						$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							$scope.input.editorMode = radioValue;

							$timeout(function () {
								platformGridAPI.grids.resize($scope.gridId);
							}, 0);
						};

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
										width: 200
									}
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

						platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						platformGridAPI.events.register($scope.gridId, 'onCellChange', onChangeGridContent);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Output', action);
								var gridContentParams = setGridItemsData(value.input, 'Params', ['id', 'key', 'value']);

								//content for codemirror
								var param = _.find(value.input, {key: 'StoredProcedureName'});
								var procedurContent = param ? param.value : '';

								return {
									gridContentParams: gridContentParams,
									procedurContent: procedurContent,
									outputValue: outputProperty ? outputProperty.value : ''
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
							$scope.input.script = ngModelCtrl.$viewValue.procedurContent;
							$scope.input.parameter = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.gridContentParams);
							platformGridAPI.items.data($scope.gridId, ngModelCtrl.$viewValue.gridContentParams ? ngModelCtrl.$viewValue.gridContentParams : []);
							$scope.outputKey = ngModelCtrl.$viewValue.outputKey;
							$scope.input.output = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							if (param === 'grid') {
								basicsWorkflowActionEditorService.setEditorInput(value.gridContentParams, 'Params', action);
							} else {
								basicsWorkflowActionEditorService.setEditorInput(value.procedurContent, 'StoredProcedureName', action);
								basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Output', action);
								basicsWorkflowActionEditorService.setEditorInput(value.gridContentParams, 'Params', action);
							}

							return action;
						});

						var counter = 11;

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
										id: counter++,
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

						function saveNgModel() {
							var gridContentParams = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridId));
							if ($scope.input.editorMode === 2) {
								gridContentParams = $scope.input.parameter;
							}

							ngModelCtrl.$setViewValue({
								gridContentParams: gridContentParams,
								procedurContent: $scope.input.script,
								scriptOutput: $scope.input.output
							});
						}

						function onChangeGridContent() {
							param = 'grid';
							ngModelCtrl.$setViewValue({
								gridContentParams: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridId))
							});

							$scope.tools.update();
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						$scope.$watch('input.script', watchfn);
						$scope.$watch('input.output', watchfn);
						$scope.$watch('input.parameter', watchfn);

						$scope.$on('$destroy', function () {
							platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
							platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onChangeGridContent);
							platformGridAPI.grids.unregister($scope.gridId);
						});
					}
				};
			}
		};
	}

	storedProcedureDatasetActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformCreateUuid',
		'platformGridAPI', 'basicsWorkflowGlobalContextUtil', 'basicsWorkflowEditModes', '$translate', '$timeout'];

	angular.module('basics.workflow')
		.directive('storedProcedureDatasetActionEditorDirective', storedProcedureDatasetActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '8d7dfd76344211e5a151feff819cdc9f',
					directive: 'storedProcedureDatasetActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
