/**
 * Created by lcn on 21/5/2020.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowUpdateInvoiceTransactionAssetContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-invoices-transaction-asset-editor.html',
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
									InvTransactionId: getDataFromAction('InvTransactionId'),
									AssetNo: getDataFromAction('AssetNo'),
									AssetDescription: getDataFromAction('AssetDescription'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.InvTransactionId = ngModelCtrl.$viewValue.InvTransactionId;
							scope.model.AssetNo = ngModelCtrl.$viewValue.AssetNo;
							scope.model.AssetDescription = ngModelCtrl.$viewValue.AssetDescription;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.InvTransactionId, 'InvTransactionId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.AssetNo, 'AssetNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.AssetDescription, 'AssetDescription', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								InvTransactionId: scope.model.InvTransactionId,
								AssetNo: scope.model.AssetNo,
								AssetDescription: scope.model.AssetDescription,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.InvTransactionId', watchfn);
						scope.$watch('model.AssetNo', watchfn);
						scope.$watch('model.AssetDescription', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUpdateInvoiceTransactionAssetContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateInvoiceTransactionAssetContainer', basicsWorkflowUpdateInvoiceTransactionAssetContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '4606C537F0264631BEDDBCE364B2AC89',
					directive: 'basicsWorkflowUpdateInvoiceTransactionAssetContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
