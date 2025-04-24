/**
 * Created by lcn on 6/08/2018.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowForwardPeriousTotalsEditorContainer(basicsWorkflowActionEditorService, platformModuleStateService, basicsWorkflowEditModes, $translate, basicsWorkflowChangeStatusService, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/forward-perious-totals-editor.html',
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
									InvoiceId: getDataFromAction('InvoiceId'),

									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {

							scope.model.InvoiceId = ngModelCtrl.$viewValue.InvoiceId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.InvoiceId, 'InvoiceId', action);

							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								InvoiceId: scope.model.InvoiceId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.InvoiceId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowForwardPeriousTotalsEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate', 'basicsWorkflowChangeStatusService', '_'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowForwardPeriousTotalsEditorContainer', basicsWorkflowForwardPeriousTotalsEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '947CBAE4D5984E029A97CB99A2099A56',
					directive: 'basicsWorkflowForwardPeriousTotalsEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
