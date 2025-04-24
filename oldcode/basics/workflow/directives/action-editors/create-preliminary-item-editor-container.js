(function (angular) {
	'use strict';

	/* global globals, _ */

	function basicsWorkflowCreatePreliminaryItemEditorDirective(basicsWorkflowActionEditorService, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-preliminary-item-editor.html',
			compile: () => {
				return {
					pre: ($scope, iElement, attr, ngModelCtrl) => {
						let action = {};

						$scope.input = {};
						$scope.output = {};
						$scope.inputOpen = true;
						$scope.outputOpen = true;
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						$scope.isPopUpOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isPopUp')
						};

						function getDataFromAction(key) {
							const param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								PpsHeader: $scope.input.PpsHeader,
								StartDate: $scope.input.StartDate,
								EndDate: $scope.input.EndDate,
								Duration: $scope.input.Duration,
								Threshold: $scope.input.Threshold,
								Probability: $scope.input.Probability,
								IsPopUp: $scope.input.IsPopUp,
								Result: $scope.output.Result
							});
						}

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								// input
								$scope.input.PpsHeader = ngModelCtrl.$viewValue.PpsHeader;
								$scope.input.StartDate = ngModelCtrl.$viewValue.StartDate;
								$scope.input.EndDate = ngModelCtrl.$viewValue.EndDate;
								$scope.input.Duration = ngModelCtrl.$viewValue.Duration;
								$scope.input.Threshold = ngModelCtrl.$viewValue.Threshold;
								$scope.input.Probability = ngModelCtrl.$viewValue.Probability;
								$scope.input.IsPopUp = ngModelCtrl.$viewValue.IsPopUp;
								// output
								$scope.output.Result = ngModelCtrl.$viewValue.Result;
							}
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;

							if (action) {
								let PpsHeader = basicsWorkflowActionEditorService.getEditorInput('PpsHeader', action);
								let startDate = basicsWorkflowActionEditorService.getEditorInput('StartDate', action);
								let endDate = basicsWorkflowActionEditorService.getEditorInput('EndDate', action);
								let duration = basicsWorkflowActionEditorService.getEditorInput('Duration', action);
								let threshold = basicsWorkflowActionEditorService.getEditorInput('Threshold', action);
								let probability = basicsWorkflowActionEditorService.getEditorInput('Probability', action);
								let isPopUp = basicsWorkflowActionEditorService.getEditorInput('IsPopUp', action);
								let result = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									PpsHeader: PpsHeader ? PpsHeader.value : '',
									StartDate: startDate ? startDate.value : '',
									EndDate: endDate ? endDate.value : '',
									Duration: duration ? duration.value : '',
									Threshold: threshold ? threshold.value : '',
									Probability: probability ? probability.value : '',
									IsPopUp: isPopUp ? isPopUp.value : '',
									Result: result ? result.value : ''
								};
							}
							return '';
						});

						// parsers needs to update the values!
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.PpsHeader, 'PpsHeader', action);
							basicsWorkflowActionEditorService.setEditorInput(value.StartDate, 'StartDate', action);
							basicsWorkflowActionEditorService.setEditorInput(value.EndDate, 'EndDate', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Duration, 'Duration', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Threshold, 'Threshold', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Probability, 'Probability', action);
							basicsWorkflowActionEditorService.setEditorInput(value.IsPopUp, 'IsPopUp', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
							return action;
						});

						$scope.changeCheckbox = function () {
							saveNgModel();
						};


						$scope.$watch('input.PpsHeader', watchfn);
						$scope.$watch('input.StartDate', watchfn);
						$scope.$watch('input.EndDate', watchfn);
						$scope.$watch('input.Duration', watchfn);
						$scope.$watch('input.Threshold', watchfn);
						$scope.$watch('input.Probability', watchfn);
						$scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreatePreliminaryItemEditorDirective.$inject = ['basicsWorkflowActionEditorService', '$translate'];

	angular.module('basics.workflow')
	  .directive('basicsWorkflowCreatePreliminaryItemEditorDirective', basicsWorkflowCreatePreliminaryItemEditorDirective)
	  .config(['basicsWorkflowModuleOptions', (basicsWorkflowModuleOptions) => {
		  basicsWorkflowModuleOptions.actionEditors.push(
			{
				actionId: '1fc771fe3e34413cb564ef0c5377db34',
				directive: 'basicsWorkflowCreatePreliminaryItemEditorDirective',
				prio: null,
				tools: []
			});
	  }]);

})(angular);