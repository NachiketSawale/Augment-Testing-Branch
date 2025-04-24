/**
 * Created by uestuenel on 09.05.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowServerWebApiGetActionEditorDirective(basicsWorkflowActionEditorService, platformGridAPI,
		platformCreateUuid, basicsWorkflowEditModes, $translate, $timeout, basicsWorkflowGlobalContextUtil, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/server-webapi-getaction-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						// init GetDetailedHttpErrorMessage checkbox
						$scope.GetDetailedHttpErrorMessageOptions = {
							ctrlId: 'GetDetailedHttpErrorMessageCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.getDetailedHttpErrorMessage'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.getDetailedHttpErrorMessage'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.getDetailedHttpErrorMessageTooltipCaption')
						};

						//radio-button
						$scope.input = {};
						$scope.input.apiMode = basicsWorkflowEditModes.default;
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

						$scope.onRadioGroupOptChangedApiMode = function changeRadioGroupOpt(radioValue, model) {
							$scope.input[model] = radioValue;
						};

						$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							$scope.input.editorMode = radioValue;

							ngModelCtrl.$render();
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						//init grid
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
							$scope.input.editorDisplayError = false;
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Output', action);
								var outputResponseProperty = basicsWorkflowActionEditorService.getEditorOutput('ResponseHeader', action);
								var param = _.find(value.input, {key: 'Headers'});

								var data = '';
								if (param) {
									try {
										data = basicsWorkflowActionEditorService.getGridDataFormat(param.value.trim().split(';'), ['id', 'key', 'value']);
									} catch (e) {
										$scope.input.editorDisplayError = true;
										//$scope.headerData = param.value;
									}
								}

								var gridData = data ? data : '';

								var paramUrl = _.find(value.input, {key: 'Url'});
								var dataUrl = '';
								if (paramUrl) {
									dataUrl = paramUrl.value;
								}

								$scope.GetDetailedHttpErrorMessage = _.find(action.input, {key: 'GetDetailedHttpErrorMessage'});

								//codeMirror2 for AccessToken
								var paramAccessToken = _.find(value.input, {key: 'AccessToken'});
								var dataAccessToken = '';
								if (paramAccessToken) {
									dataAccessToken = paramAccessToken.value;
								}

								//codeMirror3 for AccessTokenType
								var paramAccessTokenType = _.find(value.input, {key: 'AccessTokenType'});
								var dataAccessTokenType = '';
								if (paramAccessTokenType) {
									dataAccessTokenType = paramAccessTokenType.value;
								}

								var apiMode = _.find(value.input, {key: 'ApiMode'});
								if (apiMode) {
									apiMode = apiMode.value;
								}

								return {
									apiMode: apiMode ? apiMode : basicsWorkflowEditModes.default,
									gridData: gridData,
									dataUrl: dataUrl,
									getDetailedHttpErrorMessage: $scope.GetDetailedHttpErrorMessage,
									dataAccessToken: dataAccessToken,
									dataAccessTokenType: dataAccessTokenType,
									outputValue: outputProperty ? outputProperty.value : '',
									outputResponseProperty: outputResponseProperty ? outputResponseProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.input.editorDisplayError = false;
							let headersData;
							if (_.isArray(ngModelCtrl.$modelValue.input) && ngModelCtrl.$modelValue.input.length > 1) {
								let gridData = ngModelCtrl.$modelValue.input[1].value;

								if ($scope.input.editorMode === 1) {
									if (_.isString(gridData)) {
										headersData = gridData;
										try {
											gridData = basicsWorkflowActionEditorService.getGridDataFormat(gridData.trim().split(';'), ['id', 'key', 'value']);
										} catch (e) {
											gridData = [];
											$scope.input.editorDisplayError = true;
										}
									} else {
										headersData = basicsWorkflowActionEditorService.setGridDataFormat(gridData);
									}
									platformGridAPI.items.data($scope.gridId, gridData ? gridData : []);
								} else {
									if (!_.isString(gridData)) {
										headersData = basicsWorkflowActionEditorService.setGridDataFormat(gridData);
									} else {
										headersData = gridData;
									}
								}
							}

							$scope.input.apiMode = ngModelCtrl.$viewValue.apiMode;
							$scope.input.headers = headersData;
							$scope.input.script = ngModelCtrl.$viewValue.dataUrl;
							$scope.input.accessToken = ngModelCtrl.$viewValue.dataAccessToken;
							$scope.input.accessTokenType = ngModelCtrl.$viewValue.dataAccessTokenType;
							$scope.output.getAction = ngModelCtrl.$viewValue.outputValue;
							$scope.output.getGetHeader = ngModelCtrl.$viewValue.outputResponseProperty;
						};

						var param = '';

						function onChangeGridContent() {
							param = 'grid';
							ngModelCtrl.$setViewValue({
								apiMode: ngModelCtrl.$viewValue.apiMode,
								dataUrl: ngModelCtrl.$viewValue.dataUrl,
								dataAccessToken: ngModelCtrl.$viewValue.dataAccessToken,
								dataAccessTokenType: ngModelCtrl.$viewValue.dataAccessTokenType,
								outputValue: ngModelCtrl.$viewValue.outputValue,
								outputResponseProperty: ngModelCtrl.$viewValue.outputResponseProperty,
								gridData: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridId))
							});

							$scope.tools.update();
						}

						ngModelCtrl.$parsers.push(function (value) {
							if (param === 'grid') {
								basicsWorkflowActionEditorService.setEditorInput(value.gridData, 'Headers', action);
							} else {
								basicsWorkflowActionEditorService.setEditorInput(value.apiMode, 'ApiMode', action);
								basicsWorkflowActionEditorService.setEditorInput(value.gridData, 'Headers', action);
								basicsWorkflowActionEditorService.setEditorInput(value.dataUrl, 'Url', action);
								basicsWorkflowActionEditorService.setEditorInput(value.dataAccessToken, 'AccessToken', action);
								basicsWorkflowActionEditorService.setEditorInput(value.dataAccessTokenType, 'AccessTokenType', action);
								basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Output', action);
								basicsWorkflowActionEditorService.setEditorOutput(value.scriptHeaderOutput, 'ResponseHeader', action);
							}

							return action;
						});

						function saveNgModel() {
							var gridContentParams = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data($scope.gridId));
							if ($scope.input.editorMode === 2) {
								gridContentParams = $scope.input.headers;
							}

							ngModelCtrl.$setViewValue({
								apiMode: $scope.input.apiMode,
								gridData: gridContentParams,
								dataUrl: $scope.input.script,
								dataAccessToken: $scope.input.accessToken,
								dataAccessTokenType: $scope.input.accessTokenType,
								outputValue: $scope.output.getAction,
								outputResponseProperty: $scope.output.getGetHeader,
								scriptOutput: $scope.output.getAction,
								scriptHeaderOutput: $scope.output.getGetHeader,
							});
						}

						$scope.changeCheckbox = function () {
							if (!$scope.GetDetailedHttpErrorMessage) {
								return;
							}
							$scope.GetDetailedHttpErrorMessage.value = _.toString(!$scope.GetDetailedHttpErrorMessageCheckbox);
						};

						//changes in codemirror
						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						$scope.$watch(function () {
							return $scope.GetDetailedHttpErrorMessage;
						}, function (getMessage) {
							if (!getMessage) {
								return
							}
							$scope.GetDetailedHttpErrorMessageCheckbox = getMessage.value === true || getMessage.value === 'true';
						});

						$scope.$watch('input.apiMode', watchfn);
						$scope.$watch('input.script', watchfn);
						$scope.$watch('input.accessToken', watchfn);
						$scope.$watch('input.accessTokenType', watchfn);
						$scope.$watch('input.headers', watchfn);
						$scope.$watch('output.getAction', watchfn);
						$scope.$watch('output.getGetHeader', watchfn);

						var counter = 333;
						//toolbar for Params-Grid
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

	basicsWorkflowServerWebApiGetActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', 'basicsWorkflowEditModes', '$translate', '$timeout', 'basicsWorkflowGlobalContextUtil', '_'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowServerWebApiGetActionEditorDirective', basicsWorkflowServerWebApiGetActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {

			basicsWorkflowModuleOptions.actionEditors.push(
				{
					//WebApiGetAction.cs
					actionId: '4b8a00ad11e7473bb6f24e57b43e82bf',
					directive: 'basicsWorkflowServerWebApiGetActionEditorDirective',
					prio: null,
					tools: []
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					//WebApiDeleteAction.cs
					actionId: '32c635dc8c594b3a9191f47b3f619014',
					directive: 'basicsWorkflowServerWebApiGetActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
