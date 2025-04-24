/**
 * Created by lcn on 12/2/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowUpdateInvTransactionEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-invoice-transaction-editor.html',
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

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									Code: getDataFromAction('Code'),
									InvoiceId: getDataFromAction('InvoiceId'),
									IsSuccess: getDataFromAction('IsSuccess'),
									IsCanceled: getDataFromAction('IsCanceled'),
									ReturnValue: getDataFromAction('ReturnValue'),
									DocumentNo: getDataFromAction('DocumentNo'),
									AssetNo: getDataFromAction('AssetNo'),
									InvTransactionIds: getDataFromAction('InvTransactionIds'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.Code = ngModelCtrl.$viewValue.Code;
							scope.model.InvoiceId = ngModelCtrl.$viewValue.InvoiceId;
							scope.model.IsSuccess = ngModelCtrl.$viewValue.IsSuccess;
							scope.model.IsCanceled = ngModelCtrl.$viewValue.IsCanceled;
							scope.model.ReturnValue = ngModelCtrl.$viewValue.ReturnValue;
							scope.model.DocumentNo = ngModelCtrl.$viewValue.DocumentNo;
							scope.model.AssetNo = ngModelCtrl.$viewValue.AssetNo;
							scope.model.InvTransactionIds = ngModelCtrl.$viewValue.InvTransactionIds;

							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.Code, 'Code', action);
							basicsWorkflowActionEditorService.setEditorInput(value.InvoiceId, 'InvoiceId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsSuccess, 'IsSuccess', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsCanceled, 'IsCanceled', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ReturnValue, 'ReturnValue', action);
							basicsWorkflowActionEditorService.setEditorInput(value.DocumentNo, 'DocumentNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.AssetNo, 'AssetNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.InvTransactionIds, 'InvTransactionIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								Code: scope.model.Code,
								InvoiceId: scope.model.InvoiceId,
								IsSuccess: scope.model.IsSuccess,
								IsCanceled: scope.model.IsCanceled,
								ReturnValue: scope.model.ReturnValue,
								DocumentNo: scope.model.DocumentNo,
								AssetNo: scope.model.AssetNo,
								InvTransactionIds: scope.model.InvTransactionIds,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.Code', watchfn);
						scope.$watch('model.InvoiceId', watchfn);
						scope.$watch('model.IsSuccess', watchfn);
						scope.$watch('model.IsCanceled', watchfn);
						scope.$watch('model.ReturnValue', watchfn);
						scope.$watch('model.DocumentNo', watchfn);
						scope.$watch('model.AssetNo', watchfn);
						scope.$watch('model.InvTransactionIds', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUpdateInvTransactionEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateInvTransactionEditorContainer', basicsWorkflowUpdateInvTransactionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '7FC4A02272094A0EBB2AB073CFB84180',
					directive: 'basicsWorkflowUpdateInvTransactionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
