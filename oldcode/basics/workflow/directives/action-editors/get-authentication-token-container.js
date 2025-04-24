/**
 * Created by Sambit on 09.04.2021.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowGetAuthenticationTokenContainer(basicsWorkflowActionEditorService, platformGridAPI,
	                                                       platformCreateUuid, _, basicsWorkflowEditModes, $translate, $timeout, basicsWorkflowGlobalContextUtil) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-authentication-token-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.input = {};
						scope.output = {};
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.radioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							cssClass: 'cssClass',
							items: [
								{
									value: 1,
									description: 'Default Radio',
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: 'Expert Radio',
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
									description: 'UserNamePassword',
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: 'ClientSecret',
									cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.input.editorMode = radioValue;

							/*$timeout(function () {
								 platformGridAPI.grids.resize(scope.gridId);
							}, 0);*/
						};

						scope.onRadioGroupOptChangedUserNamePassword = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = radioValue;
							if (radioValue === '1') {
								scope.input.clientSecret = '';
							} else {
								scope.input.userName = '';
								scope.input.userPassword = '';
							}
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.contentOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
						//set grid
						scope.gridId = platformCreateUuid();

						scope.gridData = {
							state: scope.gridId
						};

						if (!platformGridAPI.grids.exist(scope.gridId)) {
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
								id: scope.gridId,
								options: {
									tree: false,
									indicator: true,
									idProperty: 'id'
								}
							};

							platformGridAPI.grids.config(gridConfig);
						}

						//platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						//platformGridAPI.events.register(scope.gridId, 'onCellChange', onChangeGridContent);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								//get output item
								//var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Output', action);

								//grid
								// var param = _.find(value.input, {key: 'Headers'});

								/*var data = '';
								if (param) {
									 data = basicsWorkflowActionEditorService.getGridDataFormat(param.value.trim().split(';'), ['id', 'key', 'value']);
								}
								var gridData = data ? data : '';
*/
								//codemirror
								var activeDirectoryTenant = _.find(value.input, {key: 'ActiveDirectoryTenant'});
								if (activeDirectoryTenant) {
									activeDirectoryTenant = activeDirectoryTenant.value;
								}
								//codemirror
								var activeDirectoryClientAppId = _.find(value.input, {key: 'ActiveDirectoryClientAppId'});
								if (activeDirectoryClientAppId) {
									activeDirectoryClientAppId = activeDirectoryClientAppId.value;
								}
								//codemirror
								var activeDirectoryResource = _.find(value.input, {key: 'ActiveDirectoryResource'});
								if (activeDirectoryResource) {
									activeDirectoryResource = activeDirectoryResource.value;
								}

								//multi Line Codemirror2
								var userName = _.find(value.input, {key: 'UserName'});
								if (userName) {
									userName = userName.value;
								}
								var userPassword = _.find(value.input, {key: 'UserPassword'});
								if (userPassword) {
									userPassword = userPassword.value;
								}

								//file Archive DocId look up
								var clientSecret = _.find(value.input, {key: 'ClientSecret'});
								if (clientSecret) {
									clientSecret = clientSecret.value;
								}

								var accessTokenType = _.find(value.output, {key: 'AccessTokenType'});
								if (accessTokenType) {
									accessTokenType = accessTokenType.value;
								}
								var accessToken = _.find(value.output, {key: 'AccessToken'});
								if (accessToken) {
									accessToken = accessToken.value;
								}
								var authenticationResult = _.find(value.output, {key: 'AuthenticationResult'});
								if (authenticationResult) {
									authenticationResult = authenticationResult.value;
								}

								//for selected radio option. whenever the option is selected it will be there for that value.
								scope.input.editorModeContent = userName ? '1' : clientSecret ? '2' : '1';

								return {
									activeDirectoryTenant: activeDirectoryTenant,
									activeDirectoryClientAppId: activeDirectoryClientAppId,
									activeDirectoryResource: activeDirectoryResource,
									accessTokenType: accessTokenType,
									accessToken: accessToken,
									authenticationResult: authenticationResult,
									userName: userName,
									userPassword: userPassword,
									clientSecret: clientSecret
								};
							}
							return '';
						});
						ngModelCtrl.$render = function () {
							// platformGridAPI.items.data(scope.gridId, ngModelCtrl.$viewValue.gridData ? ngModelCtrl.$viewValue.gridData : []);
							scope.input.activeDirectoryTenant = ngModelCtrl.$viewValue.activeDirectoryTenant;
							scope.input.activeDirectoryClientAppId = ngModelCtrl.$viewValue.activeDirectoryClientAppId;
							scope.input.activeDirectoryResource = ngModelCtrl.$viewValue.activeDirectoryResource;
							scope.input.userName = ngModelCtrl.$viewValue.userName;
							scope.input.userPassword = ngModelCtrl.$viewValue.userPassword;
							scope.input.clientSecret = ngModelCtrl.$viewValue.clientSecret;
							scope.output.accessTokenType = ngModelCtrl.$viewValue.accessTokenType;
							scope.output.accessToken = ngModelCtrl.$viewValue.accessToken;
							scope.output.authenticationResult = ngModelCtrl.$viewValue.authenticationResult;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.activeDirectoryTenant, 'ActiveDirectoryTenant', action);
							basicsWorkflowActionEditorService.setEditorInput(value.activeDirectoryClientAppId, 'ActiveDirectoryClientAppId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.activeDirectoryResource, 'ActiveDirectoryResource', action);
							basicsWorkflowActionEditorService.setEditorInput(value.userName, 'UserName', action);
							basicsWorkflowActionEditorService.setEditorInput(value.userPassword, 'UserPassword', action);
							basicsWorkflowActionEditorService.setEditorInput(value.clientSecret, 'ClientSecret', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.accessTokenType, 'AccessTokenType', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.accessToken, 'AccessToken', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.authenticationResult, 'AuthenticationResult', action);

							return action;
						});

						function saveNgModel() {
							// var gridContentParams = basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId));

							ngModelCtrl.$setViewValue({
								activeDirectoryTenant: scope.input.activeDirectoryTenant,
								activeDirectoryClientAppId: scope.input.activeDirectoryClientAppId,
								activeDirectoryResource: scope.input.activeDirectoryResource,
								userName: scope.input.userName,
								userPassword: scope.input.userPassword,
								clientSecret: scope.input.clientSecret,
								accessTokenType: scope.output.accessTokenType,
								accessToken: scope.output.accessToken,
								authenticationResult: scope.output.authenticationResult,
							});
						}

						//changes in codemirror
						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.activeDirectoryTenant', watchfn);
						scope.$watch('input.activeDirectoryClientAppId', watchfn);
						scope.$watch('input.activeDirectoryResource', watchfn);
						scope.$watch('input.userName', watchfn);
						scope.$watch('input.userPassword', watchfn);
						scope.$watch('input.clientSecret', watchfn);
						scope.$watch('output.accessTokenType', watchfn);
						scope.$watch('output.accessToken', watchfn);
						scope.$watch('output.authenticationResult', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowGetAuthenticationTokenContainer.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', '_', 'basicsWorkflowEditModes', '$translate', '$timeout', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetAuthenticationTokenContainer', basicsWorkflowGetAuthenticationTokenContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '7a1198bff0c3446da0306ed5d37868ed',
					directive: 'basicsWorkflowGetAuthenticationTokenContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
