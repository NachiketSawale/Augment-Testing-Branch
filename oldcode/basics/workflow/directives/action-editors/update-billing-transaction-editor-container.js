/**
 * Created by lcn on 12/2/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowUpdateBilTransactionEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-billing-transaction-editor.html',
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
									BillNo: getDataFromAction('BillNo'),
									BillingId: getDataFromAction('BillingId'),
									IsSuccess: getDataFromAction('IsSuccess'),
									IsCanceled: getDataFromAction('IsCanceled'),
									ReturnValue: getDataFromAction('ReturnValue'),
									DocumentNo: getDataFromAction('DocumentNo'),
									AssetNo: getDataFromAction('AssetNo'),
									BilTransactionIds: getDataFromAction('BilTransactionIds'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.BillNo = ngModelCtrl.$viewValue.BillNo;
							scope.model.BillingId = ngModelCtrl.$viewValue.BillingId;
							scope.model.IsSuccess = ngModelCtrl.$viewValue.IsSuccess;
							scope.model.IsCanceled = ngModelCtrl.$viewValue.IsCanceled;
							scope.model.IsCanceled = ngModelCtrl.$viewValue.IsCanceled;
							scope.model.ReturnValue = ngModelCtrl.$viewValue.ReturnValue;
							scope.model.DocumentNo = ngModelCtrl.$viewValue.DocumentNo;
							scope.model.AssetNo = ngModelCtrl.$viewValue.AssetNo;
							scope.model.BilTransactionIds = ngModelCtrl.$viewValue.BilTransactionIds;

							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.BillNo, 'BillNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.BillingId, 'BillingId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsSuccess, 'IsSuccess', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsCanceled, 'IsCanceled', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ReturnValue, 'ReturnValue', action);
							basicsWorkflowActionEditorService.setEditorInput(value.DocumentNo, 'DocumentNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.AssetNo, 'AssetNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.BilTransactionIds, 'BilTransactionIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								BillNo: scope.model.BillNo,
								BillingId: scope.model.BillingId,
								IsSuccess: scope.model.IsSuccess,
								IsCanceled: scope.model.IsCanceled,
								ReturnValue: scope.model.ReturnValue,
								DocumentNo: scope.model.DocumentNo,
								AssetNo: scope.model.AssetNo,
								BilTransactionIds: scope.model.BilTransactionIds,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.BillNo', watchfn);
						scope.$watch('model.BillingId', watchfn);
						scope.$watch('model.IsSuccess', watchfn);
						scope.$watch('model.IsCanceled', watchfn);
						scope.$watch('model.ReturnValue', watchfn);
						scope.$watch('model.DocumentNo', watchfn);
						scope.$watch('model.AssetNo', watchfn);
						scope.$watch('model.BilTransactionIds', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUpdateBilTransactionEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateBilTransactionEditorContainer', basicsWorkflowUpdateBilTransactionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'AFA989AD9F984A798CB2F010AC6E0539',
					directive: 'basicsWorkflowUpdateBilTransactionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
