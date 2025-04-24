/**
 * Created by anl on 11/23/2017.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowCreateWebServiceJobEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-webservicejob-editor.html',
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
									Message: getDataFromAction('Message'),
									IdIntern: getDataFromAction('IdIntern'),
									MsgStatus: getDataFromAction('MsgStatus'),

									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							//input
							scope.model.Message = ngModelCtrl.$viewValue.Message;
							scope.model.IdIntern = ngModelCtrl.$viewValue.IdIntern;
							scope.model.MsgStatus = ngModelCtrl.$viewValue.MsgStatus;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.Message, 'Message', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IdIntern, 'IdIntern', action);
							basicsWorkflowActionEditorService.setEditorInput(value.MsgStatus, 'MsgStatus', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								Message: scope.model.Message,
								IdIntern: scope.model.IdIntern,
								MsgStatus: scope.model.MsgStatus,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.Message', watchfn);
						scope.$watch('model.IdIntern', watchfn);
						scope.$watch('model.MsgStatus', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateWebServiceJobEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	var moduleName = 'basics.workflow';
	angular.module(moduleName).directive('basicsWorkflowCreateWebServiceJobEditorDirective', basicsWorkflowCreateWebServiceJobEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'ffd8fdaed6f04b73906976dc79896ee4',
					directive: 'basicsWorkflowCreateWebServiceJobEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
