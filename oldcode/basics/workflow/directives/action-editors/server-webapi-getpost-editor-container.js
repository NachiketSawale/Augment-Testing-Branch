/**
 * Created by uestuenel on 09.05.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowServerWebApiGetActionEditorDirective(basicsWorkflowActionEditorService, platformGridAPI,
		platformCreateUuid, _, basicsWorkflowEditModes,
		$translate, $timeout, basicsWorkflowGlobalContextUtil) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/server-webapi-postaction-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};
						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						// init GetDetailedHttpErrorMessage checkbox
						scope.GetDetailedHttpErrorMessageOptions = {
							ctrlId: 'GetDetailedHttpErrorMessageCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.getDetailedHttpErrorMessage'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.getDetailedHttpErrorMessage'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.getDetailedHttpErrorMessageTooltipCaption')
						};

						scope.input = {projectDocumentId: null};

						scope.input.apiMode = basicsWorkflowEditModes.default;

						//Radio-toggle Setting for Header
						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.radioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							cssClass: 'cssClass',
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

						scope.input.radioGroupOptContent = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							cssClass: 'cssClass',
							items: [
								{
									value: 1,
									description: 'Content',
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: 'projectDocumentId',
									cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.input.editorMode = radioValue;

							$timeout(function () {
								platformGridAPI.grids.resize(scope.gridId);
							}, 0);
						};

						scope.onRadioGroupOptChangedContent = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = radioValue;
							if (radioValue === '1') {
								scope.input.projectDocumentId = '';
							} else {
								scope.input.scriptContent = '';
							}
						};
						scope.onRadioGroupOptChangedApiMode = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = radioValue;
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.contentOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						function gridConfig(gridId) {
							if (!platformGridAPI.grids.exist(gridId)) {
								var gridConfig = {
									data: [],
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
									id: gridId,
									options: {
										tree: false,
										indicator: true,
										idProperty: 'id'
									}
								};

								platformGridAPI.grids.config(gridConfig);
							}
						}

						//set grid
						scope.gridId = platformCreateUuid();

						scope.gridData = {
							state: scope.gridId
						};
						gridConfig(scope.gridId);

						platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						platformGridAPI.events.register(scope.gridId, 'onCellChange', onChangeGridContent);

						scope.gridId_Body = platformCreateUuid();
						scope.gridData_Body = {
							state: scope.gridId_Body
						};
						gridConfig(scope.gridId_Body);
						platformGridAPI.events.register(scope.gridId_Body, 'onSelectedRowsChanged', onChangeGridBodyContent);
						platformGridAPI.events.register(scope.gridId_Body, 'onCellChange', onChangeGridBodyContent);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								//get output item
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Output', action);
								var outputResponseProperty = basicsWorkflowActionEditorService.getEditorOutput('ResponseHeader', action);
								//grid
								var param = _.find(value.input, {key: 'Headers'});

								var data = '';
								if (param) {
									data = basicsWorkflowActionEditorService.getGridDataFormat(param.value.trim().split(';'), ['id', 'key', 'value']);
								}
								var gridData = data ? data : '';

								var param_Body = _.find(value.input, {key: 'Body'});
								var data_Body = '';
								if (param_Body) {
									data_Body = basicsWorkflowActionEditorService.getGridDataFormat(param_Body.value.trim().split(';'), ['id', 'key', 'value']);
								}
								var gridData_Body = data_Body ? data_Body : '';

								//codemirror
								var paramUrl = _.find(value.input, {key: 'Url'});
								var dataUrl = '';
								if (paramUrl) {
									dataUrl = paramUrl.value;
								}

								scope.GetDetailedHttpErrorMessage = _.find(action.input, {key: 'GetDetailedHttpErrorMessage'});

								//multi Line Codemirror2
								var dataContent = _.find(value.input, {key: 'Content'});
								if (dataContent) {
									dataContent = dataContent.value;
								}

								//file Archive DocId look up
								var projectDocumentId = _.find(value.input, {key: 'projectDocumentId'});
								if (projectDocumentId) {
									projectDocumentId = projectDocumentId.value;
								}

								var apiMode = _.find(value.input, {key: 'ApiMode'});
								if (apiMode) {
									apiMode = apiMode.value;
								}

								var fileId = _.find(value.input, {key: 'FileId'});
								if (fileId) {
									fileId = fileId.value;
								}

								var fileName = _.find(value.input, {key: 'FileName'});
								if (fileName) {
									fileName = fileName.value;
								}

								//for selected radio option. whenever the option is selected it will be there for that value.
								scope.input.editorModeContent = dataContent ? '1' : projectDocumentId ? '2' : '1';

								return {
									apiMode: apiMode ? apiMode : basicsWorkflowEditModes.default,
									gridData: gridData,
									dataUrl: dataUrl,
									getDetailedHttpErrorMessage: scope.GetDetailedHttpErrorMessage,
									dataContent: dataContent,
									projectDocumentId: projectDocumentId,
									gridData_Body: gridData_Body,
									fileId: fileId,
									fileName: fileName,
									outputValue: outputProperty ? outputProperty.value : '',
									outputResponseProperty: outputResponseProperty ? outputResponseProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							platformGridAPI.items.data(scope.gridId, ngModelCtrl.$viewValue.gridData ? ngModelCtrl.$viewValue.gridData : []);
							platformGridAPI.items.data(scope.gridId_Body, ngModelCtrl.$viewValue.gridData_Body ? ngModelCtrl.$viewValue.gridData_Body : []);
							scope.input.apiMode = ngModelCtrl.$viewValue.apiMode;
							scope.input.headers = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.gridData);
							scope.input.scriptUrl = ngModelCtrl.$viewValue.dataUrl;
							scope.input.scriptContent = ngModelCtrl.$viewValue.dataContent;
							scope.input.projectDocumentId = ngModelCtrl.$viewValue.projectDocumentId;
							scope.input.body = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.gridData_Body);
							scope.input.fileId = ngModelCtrl.$viewValue.fileId;
							scope.input.fileName = ngModelCtrl.$viewValue.fileName;
							scope.outputKey = ngModelCtrl.$viewValue.outputKey;
							scope.output.getPost = ngModelCtrl.$viewValue.outputValue;
							scope.output.getPostHeader = ngModelCtrl.$viewValue.outputResponseProperty;
						};

						var param = '';

						function onChangeGridContent() {
							param = 'grid';
							ngModelCtrl.$setViewValue({
								gridData: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId))
							});
							scope.tools.update();
						}

						function onChangeGridBodyContent() {
							param = 'gridBody';
							ngModelCtrl.$setViewValue({
								gridData_Body: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId_Body))
							});
							scope.tools_Body.update();
						}

						ngModelCtrl.$parsers.push(function (value) {
							if (param === 'grid') {
								basicsWorkflowActionEditorService.setEditorInput(value.gridData, 'Headers', action);
							} else if (param === 'gridBody') {
								basicsWorkflowActionEditorService.setEditorInput(value.gridData_Body, 'Body', action);
							} else {
								basicsWorkflowActionEditorService.setEditorInput(value.apiMode, 'ApiMode', action);
								basicsWorkflowActionEditorService.setEditorInput(value.gridData, 'Headers', action);
								basicsWorkflowActionEditorService.setEditorInput(value.gridData_Body, 'Body', action);
								basicsWorkflowActionEditorService.setEditorInput(value.dataUrl, 'Url', action);
								basicsWorkflowActionEditorService.setEditorInput(value.dataContent, 'Content', action);
								basicsWorkflowActionEditorService.setEditorInput(value.projectDocumentId, 'projectDocumentId', action);
								basicsWorkflowActionEditorService.setEditorInput(value.fileId, 'FileId', action);
								basicsWorkflowActionEditorService.setEditorInput(value.fileName, 'FileName', action);
								basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Output', action);
								basicsWorkflowActionEditorService.setEditorOutput(value.scriptHeaderOutput, 'ResponseHeader', action);
							}
							return action;
						});

						function saveNgModel() {
							var gridContentParams = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId));
							var gridBodyContentParams = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId_Body));
							if (scope.input.editorMode === 2) {
								gridContentParams = scope.input.headers;
								gridBodyContentParams = scope.input.body;
							}

							ngModelCtrl.$setViewValue({
								apiMode: scope.input.apiMode,
								gridData: gridContentParams,
								gridData_Body: gridBodyContentParams,
								dataUrl: scope.input.scriptUrl,
								dataContent: scope.input.scriptContent,
								projectDocumentId: scope.input.projectDocumentId + '',
								fileId: scope.input.fileId,
								fileName: scope.input.fileName,
								scriptOutput: scope.output.getPost,
								scriptHeaderOutput: scope.output.getPostHeader
							});
						}

						scope.changeCheckbox = function () {
							if (!scope.GetDetailedHttpErrorMessage) {
								return;
							}
							scope.GetDetailedHttpErrorMessage.value = _.toString(!scope.GetDetailedHttpErrorMessageCheckbox);
						};

						//changes in codemirror
						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch(function () {
							return scope.GetDetailedHttpErrorMessage;
						}, function (getMessage) {
							if (!getMessage) {
								return
							}
							scope.GetDetailedHttpErrorMessageCheckbox = getMessage.value === true || getMessage.value === 'true';
						});

						scope.$watch('input.apiMode', watchfn);
						scope.$watch('input.scriptUrl', watchfn);
						scope.$watch('input.headers', watchfn);
						scope.$watch('input.body', watchfn);
						scope.$watch('input.scriptContent', watchfn);
						scope.$watch('input.projectDocumentId', watchfn);
						scope.$watch('input.fileId', watchfn);
						scope.$watch('input.fileName', watchfn);
						scope.$watch('output.getPost', watchfn);
						scope.$watch('output.getPostHeader', watchfn);

						var counter = 888;

						//toolbar for Params-Grid
						function getGridTools(gridId) {
							return {
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

										platformGridAPI.rows.add({gridId: gridId, item: rowItem});
										platformGridAPI.rows.scrollIntoViewByItem(gridId, rowItem);
									}
								},
									{
										id: 'delete',
										caption: 'cloud.common.toolbarDelete',
										iconClass: 'tlb-icons ico-rec-delete',
										type: 'item',
										fn: function () {
											var selItem = platformGridAPI.rows.selection({gridId: gridId});

											platformGridAPI.rows.delete({
												gridId: gridId,
												item: selItem
											});
										}
									}],
								version: 0,
								update: function () {
									this.version++;
								}
							};
						}

						scope.tools = getGridTools(scope.gridId);
						scope.tools_Body = getGridTools(scope.gridId_Body);

						scope.$on('$destroy', function () {
							platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
							platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onChangeGridContent);
							platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onChangeGridBodyContent);
							platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onChangeGridBodyContent);
							platformGridAPI.grids.unregister(scope.gridId);
						});
					},
				};
			}
		};
	}

	basicsWorkflowServerWebApiGetActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', '_', 'basicsWorkflowEditModes', '$translate', '$timeout', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowServerWebApiPostActionEditorDirective', basicsWorkflowServerWebApiGetActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					//WebApiPostAction.cs
					actionId: 'b6de8d4c81a7410cbeea47c18ddd1688',
					directive: 'basicsWorkflowServerWebApiPostActionEditorDirective',
					prio: null,
					tools: []
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					//WebApiPutAction.cs
					actionId: '88515b96aa6040fa8337a12bc4418aa8',
					directive: 'basicsWorkflowServerWebApiPostActionEditorDirective',
					prio: null,
					tools: []
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					///WebAPIPatchAction.cs
					actionId: 'e0631686a2de40768045e2d0b5696b6a',
					directive: 'basicsWorkflowServerWebApiPostActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
