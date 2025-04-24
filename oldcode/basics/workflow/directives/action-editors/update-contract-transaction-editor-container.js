/**
 * Created by pel on 23/6/2020.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowUpdateConTransactionEditorContainer(_, basicsWorkflowActionEditorService, basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-contract-transaction-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						//radio-button
						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.editorModeOld = basicsWorkflowEditModes.default;
						scope.input.editorModeNew = basicsWorkflowEditModes.default;
						scope.input.editorModeProject = basicsWorkflowEditModes.default;
						scope.input.radioGroupOpt = {
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

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);
								var success = false;
								var isSuccess = basicsWorkflowActionEditorService.getEditorInput('IsSuccess', action);
								if (isSuccess !== undefined && isSuccess !== null && isSuccess.value !== '') {
									success = isSuccess.value;
								}
								return {
									Code: getDataFromAction('Code'),
									ContractId: getDataFromAction('ContractId'),
									HandOverId: getDataFromAction('HandOverId'),
									IsSuccess: success,
									ReturnValue: getDataFromAction('ReturnValue'),
									OrderNo: getDataFromAction('OrderNo'),
									Userdefined1: getDataFromAction('Userdefined1'),
									Userdefined2: getDataFromAction('Userdefined2'),
									Userdefined3: getDataFromAction('Userdefined3'),
									ConTransactionIds: getDataFromAction('ConTransactionIds'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.Code = ngModelCtrl.$viewValue.Code;
							scope.model.ContractId = ngModelCtrl.$viewValue.ContractId;
							scope.model.IsSuccess = ngModelCtrl.$viewValue.IsSuccess;
							scope.model.HandOverId = ngModelCtrl.$viewValue.HandOverId;
							scope.model.ReturnValue = ngModelCtrl.$viewValue.ReturnValue;
							scope.model.OrderNo = ngModelCtrl.$viewValue.OrderNo;
							scope.model.Userdefined1 = ngModelCtrl.$viewValue.Userdefined1;
							scope.model.Userdefined2 = ngModelCtrl.$viewValue.Userdefined2;
							scope.model.Userdefined3 = ngModelCtrl.$viewValue.Userdefined3;
							scope.model.ConTransactionIds = ngModelCtrl.$viewValue.ConTransactionIds;

							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.Code, 'Code', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ContractId, 'ContractId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.HandOverId, 'HandOverId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsSuccess, 'IsSuccess', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ReturnValue, 'ReturnValue', action);
							basicsWorkflowActionEditorService.setEditorInput(value.OrderNo, 'OrderNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined1, 'Userdefined1', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined2, 'Userdefined2', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined3, 'Userdefined3', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ConTransactionIds, 'ConTransactionIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								Code: scope.model.Code,
								ContractId: scope.model.ContractId,
								HandOverId: scope.model.HandOverId,
								IsSuccess: scope.model.IsSuccess,
								ReturnValue: scope.model.ReturnValue,
								OrderNo: scope.model.OrderNo,
								Userdefined1: scope.model.Userdefined1,
								Userdefined2: scope.model.Userdefined2,
								Userdefined3: scope.model.Userdefined3,
								ConTransactionIds: scope.model.ConTransactionIds,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.changeCheckbox = function () {
							saveNgModel();
						};

						scope.isSuccess = {
							ctrlId: 'isSuccess',
							labelText: $translate.instant('basics.workflow.action.customEditor.isSuccess')
						};

						scope.$watch('model.Code', watchfn);
						scope.$watch('model.ContractId', watchfn);
						scope.$watch('model.HandOverId', watchfn);
						scope.$watch('model.IsSuccess', watchfn);
						scope.$watch('model.ReturnValue', watchfn);
						scope.$watch('model.OrderNo', watchfn);
						scope.$watch('model.Userdefined1', watchfn);
						scope.$watch('model.Userdefined2', watchfn);
						scope.$watch('model.Userdefined3', watchfn);
						scope.$watch('model.ConTransactionIds', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUpdateConTransactionEditorContainer.$inject = ['_', 'basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', '$translate', 'platformModuleStateService', '_'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateConTransactionEditorContainer', basicsWorkflowUpdateConTransactionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '8A2984FB22C846ED81EF17D278E7E326',
					directive: 'basicsWorkflowUpdateConTransactionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
