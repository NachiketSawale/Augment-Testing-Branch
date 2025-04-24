(function (angular) {
	'use strict';

	function basicsWorkflowModuleWizardActionEditorDirective(basicsWorkflowActionEditorService, _, basicsWorkflowEditModes, $translate, $injector, basicsLookupdataLookupFilterService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/module-wizard-task-action-editor-container.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {

						// accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						let compatibleWizards = ['7216F38E41BB4822A341D9181931A635', 'a614b22000d14e01af5ffd6e4b3d9c5e', '254C1C7B5CDF4B69836D328CD5BF75ED', '000114380A2F48D8B03075E758834F33', '397a4360629c4a098b131a751ad9e46d', '1318B8CDAC2348FDB75168138E67459E'
						, '30FB687E677240B0BF627A57B908381F'];

						let compatibleModules = ['procurement.contract', 'procurement.package', 'procurement.pes'];

						let filters = [
							{
								key: 'workflow-compatible-modules',
								fn: function (module) {
									return compatibleModules.includes(module.InternalName);
								}
							},
							{
								key: 'workflow-compatible-wizards',
								fn: function (wizard) {
									return compatibleWizards.includes(wizard.WizardEntity.WizardGUID);
								}
							}
						];

						basicsLookupdataLookupFilterService.registerFilter(filters);

						$scope.lookupOptionsModuleWizard = {
							dataServiceName: 'basicsConfigModuleWizardInstanceLookupService',
							valueMember: 'Id',
							displayMember: 'GroupWizardName',
							lookupModuleQualifier: 'basicsConfigModuleWizardInstanceLookupService',
							showClearButton: true,
							disableDataCaching: true,
							filter: function () {
								return $scope.moduleId.value;
							},
							selectableCallback: function () {
								return true;
							},
							filterKey: 'workflow-compatible-wizards'
						};

						$scope.lookupOptionsModule = {
							dataServiceName: 'basicsConfigModuleLookupService',
							valueMember: 'Id',
							displayMember: 'DescriptionInfo.Translated',
							lookupModuleQualifier: 'basicsConfigModuleLookupService',
							showClearButton: true,
							disableDataCaching: true,
							selectableCallback: function () {
								return true;
							},
							filterKey: 'workflow-compatible-modules'
						};

						$scope.isPopUpOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.isPopUp'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.isPopUpTooltipCaption')
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
							ctrlId:'AllowReassignCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.AllowReassign'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.AllowReassignRefreshTooltipCaption')
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								$scope.action = ngModelCtrl.$viewValue;
								$scope.isPopUp = _.find($scope.action.input, {key: 'IsPopUp'});
								$scope.entity = _.find($scope.action.input, {key: 'Entity'});
								$scope.moduleWizardInstanceId = _.find($scope.action.input, {key: 'ModuleWizardInstanceId'});
								$scope.context = _.find($scope.action.input, {key: 'Context'});
								$scope.moduleId = _.find($scope.action.input, {key: 'ModuleId'});
								$scope.EvaluateProxy = _.find($scope.action.input, {key: 'EvaluateProxy'});
								$scope.DisableRefresh = _.find($scope.action.input, {key: 'DisableRefresh'});
								$scope.AllowReassign = _.find($scope.action.input, {key: 'AllowReassign'});
								// output
								$scope.outputContext = _.find($scope.action.output, {key: 'Context'});
							}
						};

						$scope.$watch('moduleId', function (newVal, oldVal) {
							//reset value when module is changed
							if (newVal && oldVal && (newVal !== oldVal) && $scope.moduleWizardInstanceId && $scope.moduleWizardInstanceId.value) {
								$scope.moduleWizardInstanceId.value = null;
							}
							$scope.moduleId.value = $scope.moduleId && $scope.moduleId.value ? $scope.moduleId.value : '';
							let basicsConfigModuleLookupService = $injector.get('basicsConfigModuleLookupService');
							let moduleItem = basicsConfigModuleLookupService.getItemById($scope.moduleId.value, $scope.lookupOptionsModule);
							if (moduleItem) {
								_.find($scope.action.input, {key: 'ModuleInternalName'}).value = moduleItem.InternalName;
							}
						}, true);

						$scope.$watch('moduleWizardInstanceId', function () {
							// null values need to be empty string
							$scope.moduleWizardInstanceId.value = $scope.moduleWizardInstanceId && $scope.moduleWizardInstanceId.value ? $scope.moduleWizardInstanceId.value : '';
							let moduleWizardInstanceLookupService = $injector.get('basicsConfigModuleWizardInstanceLookupService');
							if ($scope.moduleWizardInstanceId.value) {
								var wizardItem = moduleWizardInstanceLookupService.getItemById($scope.moduleWizardInstanceId.value, $scope.lookupOptionsModuleWizard);
								if (wizardItem) {
									_.find($scope.action.input, {key: 'WizardGuid'}).value = wizardItem.WizardEntity.WizardGUID;
								}
							}
						}, true);
					}
				};
			}
		};
	}

	basicsWorkflowModuleWizardActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_', 'basicsWorkflowEditModes', '$translate', '$injector', 'basicsLookupdataLookupFilterService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowModuleWizardActionEditorDirective', basicsWorkflowModuleWizardActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '0000b9570f044808a45e7f7eab93c102',
					directive: 'basicsWorkflowModuleWizardActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
