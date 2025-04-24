/**
 * Created by clv on 5/15/2018.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowProcessBpUpdateRequestEditorContainer(basicsWorkflowActionEditorService,
	                                                             platformModuleStateService, basicsWorkflowEditModes, $translate, basicsWorkflowChangeStatusService, _) {

		return {

			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/process-bp-update-request.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {

						var action = {};
						scope.output = {};
						scope.model = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.model.name = 'BpUpdateRequest';

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									statusName: scope.model.name,
									BusinessPartnerId: getDataFromAction('BusinessPartnerId'),
									Result: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {

							scope.model.name = ngModelCtrl.$viewValue.statusName;
							scope.model.BusinessPartnerId = ngModelCtrl.$viewValue.BusinessPartnerId;
							//output
							scope.output.Result = ngModelCtrl.$viewValue.Result;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.BusinessPartnerId, 'BusinessPartnerId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'Result', action);

							return action;
						});

						function saveNgModel() {

							ngModelCtrl.$setViewValue({
								name: scope.model.name,
								BusinessPartnerId: scope.model.BusinessPartnerId,
								Result: scope.output.Result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('model.BusinessPartnerId', watchfn);
						scope.$watch('output.Result', watchfn);
					}
				};
			}

		};
	}

	basicsWorkflowProcessBpUpdateRequestEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate', 'basicsWorkflowChangeStatusService', '_'];
	angular.module('basics.workflow')
		.directive('basicsWorkflowProcessBpUpdateRequestEditorContainer', basicsWorkflowProcessBpUpdateRequestEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '103c0d6f9fee412fb3669748694d5748',
				directive: 'basicsWorkflowProcessBpUpdateRequestEditorContainer',
				prio: null,
				tools: []
			});
		}]);

})(angular);
