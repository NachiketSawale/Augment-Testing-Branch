/**
 * Created by maj on 09.27.2022.
 */
(function (angular) {
	'use strict';
	/* global globals _ */
	function basicsWorkflowCreatePlannedQuantityEditorContainer(basicsWorkflowActionEditorService, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-planned-qty-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						let action = {};
						$scope.output = {};
						$scope.model = {};
						$scope.input = {};
						$scope.inputOpen = true;
						$scope.outputOpen = true;
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						$scope.getEditorInput = basicsWorkflowActionEditorService.getEditorInput;

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
								BoqOrEstimateHeaderId: $scope.model.BoqOrEstimateHeaderId,
								PpsHeaderId: $scope.model.PpsHeaderId,
								Source: $scope.model.Source,
								CustomFunction: $scope.model.CustomFunction,
								Result: $scope.output.Result,
								NotMappedToSource: $scope.output.NotMappedToSource,
							});
						}

						ngModelCtrl.$render = function () {
							// input
							$scope.model.BoqOrEstimateHeaderId = ngModelCtrl.$viewValue.BoqOrEstimateHeaderId;
							$scope.model.PpsHeaderId = ngModelCtrl.$viewValue.PpsHeaderId;
							$scope.model.Source = ngModelCtrl.$viewValue.Source;
							$scope.model.CustomFunction = ngModelCtrl.$viewValue.CustomFunction;
							// output
							$scope.output.Result = ngModelCtrl.$viewValue.Result;
							$scope.output.NotMappedToSource = ngModelCtrl.$viewValue.NotMappedToSource;
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								const resultOutput = basicsWorkflowActionEditorService.getEditorOutput('Result', action);
								const notMappedToSourceOutput = basicsWorkflowActionEditorService.getEditorOutput('NotMappedToSource', action);

								const result = {
									BoqOrEstimateHeaderId: getDataFromAction('BoqOrEstimateHeaderId'),
									PpsHeaderId: getDataFromAction('PpsHeaderId'),
									Source: getDataFromAction('Source'),
									CustomFunction: getDataFromAction('CustomFunction'),
									Result: resultOutput ? resultOutput.value : '',
									NotMappedToSource: notMappedToSourceOutput ? notMappedToSourceOutput.value : '',
								};
								SetDefaultCustomFunction(result);
								return result;
							}

							return '';

							function SetDefaultCustomFunction(result) {
								// set default custom function when the action is being added to a workflow template
								const defaultCustomFunction = 'PPS_CREATEPLANNEDQUANTITY_SP';
								const keys = Object.keys(result);

								if (Array.isArray(keys) && keys.length > 0 && keys.every(key => result[key] === '')) {
									result.CustomFunction = defaultCustomFunction;
								}
							}
						});

						// parsers needs to update the values!
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.BoqOrEstimateHeaderId, 'BoqOrEstimateHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.PpsHeaderId, 'PpsHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.Source, 'Source', action);
							basicsWorkflowActionEditorService.setEditorInput(value.CustomFunction, 'CustomFunction', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.NotMappedToSource, 'NotMappedToSource', action);
							return action;
						});

						$scope.$watch('model.BoqOrEstimateHeaderId', watchfn);
						$scope.$watch('model.PpsHeaderId', watchfn);
						$scope.$watch('model.Source', watchfn);
						$scope.$watch('model.CustomFunction', watchfn);
						$scope.$watch('output.Result', watchfn);
						$scope.$watch('output.NotMappedToSource', watchfn);

						$scope.selectOptions = {
							displayMember: 'description',
							valueMember: 'value',
							items: [{
								value: 'BoqItem',
								description: $translate.instant('basics.workflow.action.customEditor.plannedQtySource.boqItem')
							}, {
								value: 'Estimate',
								description: $translate.instant('basics.workflow.action.customEditor.plannedQtySource.estimate')
							}]
						};
					}
				};
			}
		};
	}

	basicsWorkflowCreatePlannedQuantityEditorContainer.$inject = ['basicsWorkflowActionEditorService', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowCreatePlannedQuantityEditorContainer', basicsWorkflowCreatePlannedQuantityEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '6965fabac28a444799943a4be6d11532',
					directive: 'basicsWorkflowCreatePlannedQuantityEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
