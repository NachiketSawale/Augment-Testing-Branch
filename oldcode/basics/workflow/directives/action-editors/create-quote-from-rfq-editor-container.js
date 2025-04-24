/**
 * Created by clv on 5/15/2018.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowCreateQuoteFromRfqEditorContainer(basicsWorkflowActionEditorService,
	                                                         platformModuleStateService, basicsWorkflowEditModes, $translate, basicsWorkflowChangeStatusService, _) {

		return {

			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-quote-from-rfq-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {

						var action = {};
						scope.output = {};
						scope.model = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.model.name = 'quote';

						scope.selectOptionsStatus = {
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id',
							items: [],
							service: basicsWorkflowChangeStatusService,
							serviceMethod: 'getParameters',
							serviceReload: true
						};

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);
								var outputErrorProperty = basicsWorkflowActionEditorService.getEditorOutput('Error', action);

								return {
									statusName: scope.model.name,
									RfqHeaderId: getDataFromAction('RfqHeaderId'),
									BidderId: getDataFromAction('BidderId'),
									QtnStatusId: getDataFromAction('QtnStatusId'),
									ExceptionStopped: getDataFromAction('ExceptionStopped'),
									Result: outputProperty ? outputProperty.value : '',
									Error: outputErrorProperty ? outputErrorProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {

							//NewStatusId scopes
							scope.model.QtnStatusId = parseInt(ngModelCtrl.$viewValue.QtnStatusId) ? parseInt(ngModelCtrl.$viewValue.QtnStatusId) : 0;

							scope.model.name = ngModelCtrl.$viewValue.statusName;
							scope.model.RfqHeaderId = ngModelCtrl.$viewValue.RfqHeaderId;
							scope.model.BidderId = ngModelCtrl.$viewValue.BidderId;
							var exceptionStopped = ngModelCtrl.$viewValue.ExceptionStopped;
							scope.model.ExceptionStopped = exceptionStopped === '' ? true : exceptionStopped;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.Result;
							scope.output.Error = ngModelCtrl.$viewValue.Error;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.RfqHeaderId, 'RfqHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.BidderId, 'BidderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.QtnStatusId, 'QtnStatusId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ExceptionStopped, 'ExceptionStopped', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.ScriptOutput, 'Result', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.ErrorOutput, 'Error', action);

							return action;
						});

						function saveNgModel() {

							var newStatusId = scope.model.QtnStatusId;

							ngModelCtrl.$setViewValue({
								name: scope.model.name,
								RfqHeaderId: scope.model.RfqHeaderId,
								BidderId: scope.model.BidderId,
								QtnStatusId: newStatusId,
								ExceptionStopped: scope.model.ExceptionStopped,
								ScriptOutput: scope.output.Result,
								ErrorOutput: scope.output.Error
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.RfqHeaderId', watchfn);
						scope.$watch('model.BidderId', watchfn);
						scope.$watch('model.QtnStatusId', watchfn);
						scope.$watch('model.ExceptionStopped', watchfn);
						scope.$watch('output.Result', watchfn);
						scope.$watch('output.Error', watchfn);
					}
				};
			}

		};
	}

	basicsWorkflowCreateQuoteFromRfqEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate', 'basicsWorkflowChangeStatusService', '_'];
	angular.module('basics.workflow')
		.directive('basicsWorkflowCreateQuoteFromRfqEditorContainer', basicsWorkflowCreateQuoteFromRfqEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '1793c3336a5f4eda88ecdd12a87db7e6',
				directive: 'basicsWorkflowCreateQuoteFromRfqEditorContainer',
				prio: null,
				tools: []
			});
		}]);

})(angular);
