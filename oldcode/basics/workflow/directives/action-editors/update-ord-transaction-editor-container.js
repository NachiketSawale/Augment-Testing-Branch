(function (angular) {
	'use strict';

	function basicsWorkflowUpdateOrdTransactionEditorContainer(basicsWorkflowActionEditorService, basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-ord-transaction-editor.html',
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
									OrdId: getDataFromAction('OrdId'),
									HandOverId: getDataFromAction('HandOverId'),
									IsSuccess: getDataFromAction('IsSuccess'),
									ReturnValue: getDataFromAction('ReturnValue'),
									OrdNo: getDataFromAction('OrdNo'),
									Userdefined1: getDataFromAction('Userdefined1'),
									Userdefined2: getDataFromAction('Userdefined2'),
									Userdefined3: getDataFromAction('Userdefined3'),
									OrdTransactionIds: getDataFromAction('OrdTransactionIds'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.Code = ngModelCtrl.$viewValue.Code;
							scope.model.OrdId = ngModelCtrl.$viewValue.OrdId;
							scope.model.IsSuccess = ngModelCtrl.$viewValue.IsSuccess;
							scope.model.HandOverId = ngModelCtrl.$viewValue.HandOverId;
							scope.model.ReturnValue = ngModelCtrl.$viewValue.ReturnValue;
							scope.model.OrdNo = ngModelCtrl.$viewValue.OrdNo;
							scope.model.Userdefined1 = ngModelCtrl.$viewValue.Userdefined1;
							scope.model.Userdefined2 = ngModelCtrl.$viewValue.Userdefined2;
							scope.model.Userdefined3 = ngModelCtrl.$viewValue.Userdefined3;
							scope.model.OrdTransactionIds = ngModelCtrl.$viewValue.OrdTransactionIds;

							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.Code, 'Code', action);
							basicsWorkflowActionEditorService.setEditorInput(value.OrdId, 'OrdId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.HandOverId, 'HandOverId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsSuccess, 'IsSuccess', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ReturnValue, 'ReturnValue', action);
							basicsWorkflowActionEditorService.setEditorInput(value.OrdNo, 'OrdNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined1, 'Userdefined1', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined2, 'Userdefined2', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined3, 'Userdefined3', action);
							basicsWorkflowActionEditorService.setEditorInput(value.OrdTransactionIds, 'OrdTransactionIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								Code: scope.model.Code,
								OrdId: scope.model.OrdId,
								HandOverId: scope.model.HandOverId,
								IsSuccess: scope.model.IsSuccess,
								ReturnValue: scope.model.ReturnValue,
								OrdNo: scope.model.OrdNo,
								Userdefined1: scope.model.Userdefined1,
								Userdefined2: scope.model.Userdefined2,
								Userdefined3: scope.model.Userdefined3,
								OrdTransactionIds: scope.model.OrdTransactionIds,
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
						scope.$watch('model.OrdId', watchfn);
						scope.$watch('model.HandOverId', watchfn);
						scope.$watch('model.IsSuccess', watchfn);
						scope.$watch('model.ReturnValue', watchfn);
						scope.$watch('model.OrdNo', watchfn);
						scope.$watch('model.Userdefined1', watchfn);
						scope.$watch('model.Userdefined2', watchfn);
						scope.$watch('model.Userdefined3', watchfn);
						scope.$watch('model.OrdTransactionIds', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUpdateOrdTransactionEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', '$translate', 'platformModuleStateService', '_'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateOrdTransactionEditorContainer', basicsWorkflowUpdateOrdTransactionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '1FFD9D0828C890F34CECB0F7B53677A2',
					directive: 'basicsWorkflowUpdateOrdTransactionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
