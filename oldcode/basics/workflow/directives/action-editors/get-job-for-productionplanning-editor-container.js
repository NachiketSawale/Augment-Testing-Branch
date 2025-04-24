(function (angular) {
	'use strict';
	/* global globals _ */
	function basicsWorkflowGetJobForProductionplanningEditorContainer(basicsWorkflowActionEditorService, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-job-for-productionplanning-editor.html',
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
						$scope.ppsHeaderRequired = false;

						function getDataFromAction(key) {
							const param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
								$scope.ppsHeaderRequired = $scope.model.CreatePpsHeader;
							}
						}

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								OrderHeaderId: $scope.model.OrderHeaderId,
								EstimateHeaderId: $scope.model.EstimateHeaderId,
								JobTypeId: $scope.model.JobTypeId,
								CreatePpsHeader: $scope.model.CreatePpsHeader,
								SiteId: $scope.model.SiteId,
								ClerkId: $scope.model.ClerkId,
								Result: $scope.output.Result
							});
						}

						ngModelCtrl.$render = function () {
							// input
							$scope.model.OrderHeaderId = ngModelCtrl.$viewValue.OrderHeaderId;
							$scope.model.EstimateHeaderId = ngModelCtrl.$viewValue.EstimateHeaderId;
							$scope.model.JobTypeId = ngModelCtrl.$viewValue.JobTypeId;
							$scope.model.CreatePpsHeader = ngModelCtrl.$viewValue.CreatePpsHeader;
							$scope.model.SiteId = ngModelCtrl.$viewValue.SiteId;
							$scope.model.ClerkId = ngModelCtrl.$viewValue.ClerkId;
							// output
							$scope.output.Result = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$formatters.push(function (value) {
							// let data = _.find(value.input, {key: 'EndDate'});
							// data.value = data.value || moment.utc(Date.now());

							action = value;
							if (action) {
								const outputProperty = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									OrderHeaderId: getDataFromAction('OrderHeaderId'),
									EstimateHeaderId: getDataFromAction('EstimateHeaderId'),
									JobTypeId: getDataFromAction('JobTypeId'),
									CreatePpsHeader: getDataFromAction('CreatePpsHeader') || false,
									//EndDate: getDataFromAction('EndDate') || moment.utc(Date.now()),
									SiteId: getDataFromAction('SiteId'),
									ClerkId: getDataFromAction('ClerkId'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						// parsers needs to update the values!
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.OrderHeaderId, 'OrderHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.EstimateHeaderId, 'EstimateHeaderId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.JobTypeId, 'JobTypeId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.CreatePpsHeader, 'CreatePpsHeader', action);
							basicsWorkflowActionEditorService.setEditorInput(value.SiteId, 'SiteId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.ClerkId, 'ClerkId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.Result, 'Result', action);
							return action;
						});

						$scope.$watch('model.OrderHeaderId', watchfn);
						$scope.$watch('model.EstimateHeaderId', watchfn);
						$scope.$watch('model.JobTypeId', watchfn);
						$scope.$watch('model.CreatePpsHeader', watchfn);
						$scope.$watch('model.SiteId', watchfn);
						$scope.$watch('model.ClerkId', watchfn);
						$scope.$watch('output.Result', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowGetJobForProductionplanningEditorContainer.$inject = ['basicsWorkflowActionEditorService', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetJobForProductionplanningEditorContainer', basicsWorkflowGetJobForProductionplanningEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '0282A0A57DE74718AF08EB9F868F594B',
					directive: 'basicsWorkflowGetJobForProductionplanningEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
