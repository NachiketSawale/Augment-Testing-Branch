(function (angular) {
	'use strict';

	function basicsWorkflowGenericWizardActionEditorDirective(basicsWorkflowActionEditorService, _, basicsWorkflowEditModes, $translate, platformModuleStateService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/generic-wizard-task-action-editor-container.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {

						// accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						$scope.lookupOptionsGenericWizard = {
							dataServiceName: 'basicsConfigGenericWizardInstanceLookupService',
							valueMember: 'Id',
							displayMember: 'CommentInfo.Description',
							showClearButton: true
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

						$scope.isPopUpOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.isPopUpTooltipCaption')
						};

						$scope.isNotificationOptions = {
							ctrlId: 'isNotificationCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isNotification'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.isNotification'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.isNotificationTooltipCaption')
						};

						$scope.EvaluateProxyOptions = {
							ctrlId: 'EvaluateProxyCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.EvaluateProxyTooltipCaption')
						};

						$scope.DisableRefreshOptions = {
							ctrlId: 'DisableRefreshCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.DisableRefresh'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.DisableRefresh'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.DisableRefreshTooltipCaption')
						};

						$scope.AllowReassignOptions = {
							ctrlId: 'AllowReassignCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.AllowReassignRefreshTooltipCaption')
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								$scope.action = ngModelCtrl.$viewValue;
								$scope.isPopUp = _.find($scope.action.input, {key: 'IsPopUp'});
								$scope.entity = _.find($scope.action.input, {key: 'EntityId'});
								$scope.genericWizardInstanceId = _.find($scope.action.input, {key: 'GenericWizardInstanceId'});
								$scope.context = _.find($scope.action.input, {key: 'Context'});
								$scope.workflowTemplateId = _.find($scope.action.input, {key: 'WorkflowTemplateId'});
								$scope.EvaluateProxy = _.find($scope.action.input, {key: 'EvaluateProxy'});
								$scope.DisableRefresh = _.find($scope.action.input, {key: 'DisableRefresh'});
								$scope.AllowReassign = _.find($scope.action.input, {key: 'AllowReassign'});
								// output
								$scope.outputContext = _.find($scope.action.output, {key: 'Context'});
							}
						};

						$scope.$watch('genericWizardInstanceId', function () {
							// null values need to be empty string
							$scope.genericWizardInstanceId.value = $scope.genericWizardInstanceId && $scope.genericWizardInstanceId.value ? $scope.genericWizardInstanceId.value : '';
						}, true);

						$scope.$watch('workflowTemplateId', function () {
							$scope.workflowTemplateId.value = $scope.workflowTemplateId && $scope.workflowTemplateId.value ? $scope.workflowTemplateId.value : '';
						}, true);

					}
				};
			}
		};
	}

	basicsWorkflowGenericWizardActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_', 'basicsWorkflowEditModes', '$translate', 'platformModuleStateService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGenericWizardActionEditorDirective', basicsWorkflowGenericWizardActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '0000e5b3c39e4221a626bdb76d9ce1ee',
					directive: 'basicsWorkflowGenericWizardActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
