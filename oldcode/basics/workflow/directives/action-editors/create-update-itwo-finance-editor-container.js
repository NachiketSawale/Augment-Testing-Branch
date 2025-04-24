/**
 * Created by uestuenel on 31.05.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowCreateUpdateItwoFinanceCustomerEditorDirective(basicsWorkflowActionEditorService, $translate, basicsWorkflowEditModes) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-update-itwo-finance-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						$scope.businesspartner = {};
						$scope.company = {};

						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.input = {};
						$scope.input.editorMode = basicsWorkflowEditModes.default;
						$scope.input.editorModeCompany = basicsWorkflowEditModes.default;
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

								var contentBP = getDataFromAction('BusinessPartnerId');
								var contentCompany = getDataFromAction('CompanyId');

								return {
									contentBP: contentBP,
									contentCompany: contentCompany,
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
							$scope.businesspartner.script = ngModelCtrl.$viewValue.contentBP;
							$scope.businesspartner.select = parseInt(ngModelCtrl.$viewValue.contentBP) ? ngModelCtrl.$viewValue.contentBP : 0;

							//set company-radiobutton
							if ($scope.businesspartner.select === 0 && ngModelCtrl.$viewValue.contentBP !== '') {
								$scope.input.editorMode = basicsWorkflowEditModes.expert;
							}

							$scope.company.script = ngModelCtrl.$viewValue.contentCompany;
							$scope.company.select = parseInt(ngModelCtrl.$viewValue.contentCompany) ? ngModelCtrl.$viewValue.contentCompany : 0;

							//set company-radiobutton
							if ($scope.company.select === 0 && ngModelCtrl.$viewValue.contentCompany !== '') {
								$scope.input.editorModeCompany = basicsWorkflowEditModes.expert;
							}

							//output parameter
							$scope.output.code = ngModelCtrl.$viewValue.outputValue;
							$scope.output.message = ngModelCtrl.$viewValue.outputValue2;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.contentCompany, 'CompanyId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.contentBP, 'BusinessPartnerId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'ResultCode', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput2, 'ResultMessage', action);

							return action;
						});

						//lookup for Businesspartner
						$scope.businesspartner.selectConfig = {
							rt$change: function () {
								saveNgModel();
							}
						};

						//lookup for Company
						$scope.company.selectConfig = {
							rt$change: function () {
								saveNgModel();
							}
						};

						function saveNgModel() {
							//save content from codemirror or selecteditem
							var bp = $scope.input.editorMode === 2 ? $scope.businesspartner.script : $scope.businesspartner.select;
							var company = $scope.input.editorModeCompany === 2 ? $scope.company.script : $scope.company.select;

							ngModelCtrl.$setViewValue({
								contentBP: bp,
								contentCompany: company,
								scriptOutput: $scope.output.code,
								scriptOutput2: $scope.output.message
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						$scope.$watch('company.script', watchfn);
						$scope.$watch('businesspartner.script', watchfn);
						$scope.$watch('output.message', watchfn);
						$scope.$watch('output.code', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateUpdateItwoFinanceCustomerEditorDirective.$inject = ['basicsWorkflowActionEditorService', '$translate', 'basicsWorkflowEditModes'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowCreateUpdateItwoFinanceCustomerEditorDirective', basicsWorkflowCreateUpdateItwoFinanceCustomerEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '46290D2AE7C44310BC89A56A8763741F',
					directive: 'basicsWorkflowCreateUpdateItwoFinanceCustomerEditorDirective',
					prio: null,
					tools: []
				}
			);
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '881EAA652CAC4D4D8747EB003FCF49AA',
					directive: 'basicsWorkflowCreateUpdateItwoFinanceCustomerEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
