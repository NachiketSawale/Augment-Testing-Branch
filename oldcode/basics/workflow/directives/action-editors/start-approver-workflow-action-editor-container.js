(function (angular) {
	'use strict';

	function BasicsWorkflowStartApproverWorkflowEditorDirective(basicsWorkflowActionEditorService, _, basicsWorkflowEditModes, $translate, platformModuleStateService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/start-approver-workflow-action-editor-container.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {

						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.lookupOptionsGenericWizard = {
							dataServiceName: 'basicsConfigGenericWizardUseCaseLookupService',
							valueMember: 'WizardConfiGuuid',
							displayMember: 'CommentInfo.Description',
							showClearButton: false
						};

						$scope.lookupOptionsWorkflowTemplate = {
							dataServiceName: 'basicsCustomWorkflowTemplateLookupDataService',
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basicsCustomWorkflowTemplateLookupDataService',
							showClearButton: true,
							filter: function () {
								return platformModuleStateService.state('basics.workflow').selectedMainEntity ? platformModuleStateService.state('basics.workflow').selectedMainEntity.EntityId : null;
							},
							selectableCallback: function (item) {
								var selectedIdTemplateId = platformModuleStateService.state('basics.workflow').selectedMainEntity ? platformModuleStateService.state('basics.workflow').selectedMainEntity.Id : 0;
								return selectedIdTemplateId !== item.Id;
							}
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								$scope.action = ngModelCtrl.$viewValue;
								$scope.mainEntityId = _.find($scope.action.input, {key: 'MainEntityId'});
								$scope.useCaseUUid = _.find($scope.action.input, {key: 'UseCaseUUid'});
								$scope.context = _.find($scope.action.input, {key: 'Context'});
								$scope.workflowTemplateId = _.find($scope.action.input, {key: 'WorkflowTemplateId'});
								$scope.classifiedNumber = _.find($scope.action.input, {key: 'ClassifiedNumber'});
								$scope.classifiedDate = _.find($scope.action.input, {key: 'ClassifiedDate'});
								$scope.classifiedAmount = _.find($scope.action.input, {key: 'ClassifiedAmount'});
								$scope.classifiedText = _.find($scope.action.input, {key: 'ClassifiedText'});
								//output
								$scope.result = _.find($scope.action.output, {key: 'Result'});
								$scope.configErrors = _.find($scope.action.output, { key: 'ConfigErrors' });
							}
						};

						$scope.$watch('useCaseUUid', function () {
							//null values need to be empty string
							$scope.useCaseUUid.value = $scope.useCaseUUid && $scope.useCaseUUid.value ? $scope.useCaseUUid.value : '';
						}, true);

						$scope.$watch('workflowTemplateId', function () {
							$scope.workflowTemplateId.value = $scope.workflowTemplateId && $scope.workflowTemplateId.value ? $scope.workflowTemplateId.value : '';
						}, true);

					}
				};
			}
		};
	}

	BasicsWorkflowStartApproverWorkflowEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_', 'basicsWorkflowEditModes', '$translate', 'platformModuleStateService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowStartApproverWorkflowEditorDirective', BasicsWorkflowStartApproverWorkflowEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'eda68800d6fc426581c7fe22d1086612',
					directive: 'basicsWorkflowStartApproverWorkflowEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
