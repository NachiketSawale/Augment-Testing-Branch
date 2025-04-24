/**
 * Created by lcn on 12/2/2019.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowUpdateBillingHeaderEditorContainer(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/update-billing-header-editor.html',
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
									NewBillNo: getDataFromAction('NewBillNo'),
									Remark: getDataFromAction('Remark'),
									Userdefined1: getDataFromAction('Userdefined1'),
									Userdefined2: getDataFromAction('Userdefined2'),
									Userdefined3: getDataFromAction('Userdefined3'),
									Userdefined4: getDataFromAction('Userdefined4'),
									Userdefined5: getDataFromAction('Userdefined5'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.BillNo = ngModelCtrl.$viewValue.BillNo;
							scope.model.BillingId = ngModelCtrl.$viewValue.BillingId;
							scope.model.NewBillNo = ngModelCtrl.$viewValue.NewBillNo;
							scope.model.Remark = ngModelCtrl.$viewValue.Remark;
							scope.model.Userdefined1 = ngModelCtrl.$viewValue.Userdefined1;
							scope.model.Userdefined2 = ngModelCtrl.$viewValue.Userdefined2;
							scope.model.Userdefined3 = ngModelCtrl.$viewValue.Userdefined3;
							scope.model.Userdefined4 = ngModelCtrl.$viewValue.Userdefined4;
							scope.model.Userdefined5 = ngModelCtrl.$viewValue.Userdefined5;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.BillNo, 'BillNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.BillingId, 'BillingId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.NewBillNo, 'NewBillNo', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Remark, 'Remark', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined1, 'Userdefined1', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined2, 'Userdefined2', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined3, 'Userdefined3', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined4, 'Userdefined4', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Userdefined5, 'Userdefined5', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								BillNo: scope.model.BillNo,
								BillingId: scope.model.BillingId,
								NewBillNo: scope.model.NewBillNo,
								Remark: scope.model.Remark,
								Userdefined1: scope.model.Userdefined1,
								Userdefined2: scope.model.Userdefined2,
								Userdefined3: scope.model.Userdefined3,
								Userdefined4: scope.model.Userdefined4,
								Userdefined5: scope.model.Userdefined5,
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
						scope.$watch('model.NewBillNo', watchfn);
						scope.$watch('model.Remark', watchfn);
						scope.$watch('model.Userdefined1', watchfn);
						scope.$watch('model.Userdefined2', watchfn);
						scope.$watch('model.Userdefined3', watchfn);
						scope.$watch('model.Userdefined4', watchfn);
						scope.$watch('model.Userdefined5', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowUpdateBillingHeaderEditorContainer.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowUpdateBillingHeaderEditorContainer', basicsWorkflowUpdateBillingHeaderEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '1A32B8699B4B4161BAA6B314D4149DF9',
					directive: 'basicsWorkflowUpdateBillingHeaderEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);

