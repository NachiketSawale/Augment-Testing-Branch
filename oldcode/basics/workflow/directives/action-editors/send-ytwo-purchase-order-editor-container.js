/**
 * Created by chi on 11/28/2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowSendYTwoPurchaseOrderEditorDirective(basicsWorkflowActionEditorService, $translate, basicsWorkflowEditModes) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/send-ytwo-purchase-order-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						$scope.contract = {};

						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.input = {};
						$scope.input.editorMode = basicsWorkflowEditModes.default;
						$scope.input.radioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
									cssClass: 'pull-left spaceToUp'
									// cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
							$scope.input[model] = parseInt(radioValue);
						};

						//codemirror business
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;

							if (value) {
								//first output parameter
								var outputProperty1 = basicsWorkflowActionEditorService.getEditorOutput('ResultCode', action);
								//second output parameter
								var outputProperty2 = basicsWorkflowActionEditorService.getEditorOutput('ResultMessage', action);

								var contentContract = getDataFromAction('ContractId');

								return {
									contentContract: contentContract,
									outputValue: outputProperty1 ? outputProperty1.value : '',
									outputValue2: outputProperty2 ? outputProperty2.value : ''
								};
							}
							return '';
						});

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$render = function () {
							$scope.contract.script = ngModelCtrl.$viewValue.contentContract;
							//output parameter
							$scope.output.code = ngModelCtrl.$viewValue.outputValue;
							$scope.output.message = ngModelCtrl.$viewValue.outputValue2;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.contentContract, 'ContractId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'ResultCode', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput2, 'ResultMessage', action);

							return action;
						});

						//lookup for Contract
						$scope.contract.selectConfig = {
							rt$change: function () {
								saveNgModel();
							}
						};

						function saveNgModel() {
							//save content from codemirror or selecteditem
							var contract = $scope.contract.script;

							ngModelCtrl.$setViewValue({
								contentContract: contract,
								scriptOutput: $scope.output.code,
								scriptOutput2: $scope.output.message
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						$scope.$watch('contract.script', watchfn);
						$scope.$watch('output.message', watchfn);
						$scope.$watch('output.code', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowSendYTwoPurchaseOrderEditorDirective.$inject = ['basicsWorkflowActionEditorService', '$translate', 'basicsWorkflowEditModes'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName)
		.directive('basicsWorkflowSendYTwoPurchaseOrderEditorDirective', basicsWorkflowSendYTwoPurchaseOrderEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '48FCFCC9F49F4D8DABD7CBF530A04186',
					directive: 'basicsWorkflowSendYTwoPurchaseOrderEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
