/**
 * Created by uestuenel on 12.05.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowSqlActionEditorDirective(basicsWorkflowActionEditorService, platformCreateUuid, platformGridAPI,
	                                                _, basicsWorkflowEditModes, $timeout, $translate, basicsWorkflowGlobalContextUtil) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/sql-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						//radio-button

						scope.editorMode = basicsWorkflowEditModes.default;
						scope.radioGroupOpt = {
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

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.editorMode = radioValue;

							$timeout(function () {
								platformGridAPI.grids.resize(scope.gridId);
							}, 0);
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.SQLOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
						scope.SQLOptions.mode = 'sql';

						//set grid
						scope.gridId = platformCreateUuid();

						scope.gridData = {
							state: scope.gridId,
							config: {},
						};

						if (!platformGridAPI.grids.exist(scope.gridId)) {
							var gridConfig = {
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
										width: 200
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
								id: scope.gridId,
								options: {
									tree: false,
									indicator: true,
									idProperty: 'id'
								}
							};
							platformGridAPI.grids.config(gridConfig);
						}

						platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						platformGridAPI.events.register(scope.gridId, 'onCellChange', onChangeGridContent);

						function setGridData(valueInput, keyName, gridColumns) {
							var actionInputItem = _.find(valueInput, {key: keyName});
							var gridContent = [];
							if (actionInputItem && actionInputItem.value) {
								if (actionInputItem.value.includes(':') && actionInputItem.value.includes(';')) {
									gridContent = basicsWorkflowActionEditorService.getGridDataFormat(actionInputItem.value.trim().split(';'), gridColumns);
								}
							}
							return gridContent;
						}

						ngModelCtrl.$render = function () {
							scope.action = ngModelCtrl.$viewValue;
							scope.sql = _.find(scope.action.input, {key: 'SQL'});
							scope.gridData = setGridData(scope.action.input, 'Params', ['id', 'key', 'value']);
							scope.gridData.state = scope.gridId;
							platformGridAPI.items.data(scope.gridId, scope.gridData);
							scope.params = _.find(scope.action.input, {key: 'Params'});
							if (scope.gridData.length === 0 && scope.params.value.length > 0) {
								scope.editorMode = 2;
							}
							scope.output = _.find(scope.action.output, {key: 'Output'});
						};

						function onChangeGridContent() {
							var viewValue = ngModelCtrl.$viewValue;
							scope.params.value = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId));
							basicsWorkflowActionEditorService.setEditorInput(scope.params.value, 'Params', viewValue);
							ngModelCtrl.$setViewValue(viewValue);
							scope.tools.update();
						}

						var counter = 6854;
						//toolbar for Params-Grid
						scope.tools = {
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
										key: ' ',
										value: ' '
									};

									platformGridAPI.rows.add({gridId: scope.gridId, item: rowItem});
									platformGridAPI.rows.scrollIntoViewByItem(scope.gridId, rowItem);
								},
								disabled: function () {
									return scope.codeMirrorOptions.readOnly !== false;
								}
							},
								{
									id: 'delete',
									caption: 'cloud.common.toolbarDelete',
									iconClass: 'tlb-icons ico-rec-delete',
									type: 'item',
									fn: function () {
										var selItem = platformGridAPI.rows.selection({gridId: scope.gridId});

										platformGridAPI.rows.delete({
											gridId: scope.gridId,
											item: selItem
										});

										platformGridAPI.grids.refresh(scope.gridId, true);
									},
									disabled: function () {
										return scope.codeMirrorOptions.readOnly !== false;
									}
								}],
							version: 0,
							update: function () {
								this.version++;
							}
						};

						scope.$watch(function () {
							return scope.params.value;
						}, function (newVal) {
							if (newVal) {
								scope.gridData = setGridData(scope.action.input, 'Params', ['id', 'key', 'value']);
								scope.gridData.state = scope.gridId;
								platformGridAPI.items.data(scope.gridId, scope.gridData);
							}
						});

						scope.$on('$destroy', function () {
							platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
							platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onChangeGridContent);
							platformGridAPI.grids.unregister(scope.gridId);
						});
					}
				};
			}
		};
	}

	basicsWorkflowSqlActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformCreateUuid',
		'platformGridAPI', '_', 'basicsWorkflowEditModes', '$timeout', '$translate', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowSqlActionEditorDirective', basicsWorkflowSqlActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '6f3a49b7c1b94448886a868625829e4d',
					directive: 'basicsWorkflowSqlActionEditorDirective',
					prio: null,
					tools: []
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'a2082812f7b8422db526933444f33d13',
					directive: 'basicsWorkflowSqlActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
