(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowEntityDataEditorDirective(_, basicsWorkflowActionEditorService, platformModuleStateService,
	                                                 basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/entity-data-editor.html',
			scope: {ngModel: '='},
			compile: function compile() {
				return {
					pre: function postLink($scope) {
						$scope.action = $scope.ngModel;
						$scope.inputOpen = true;
						$scope.outputOpen = true;
						$scope.editorMode = basicsWorkflowEditModes.default;

						//init selectBox
						let state = platformModuleStateService.state('basics.workflow');

						_.each(state.workflowDataEntities, function (entity) {
							entity.DisplayValue = entity.EntityName + (entity.ModuleName ? ' - ' + entity.ModuleName.toLowerCase() : '');
						});

						$scope.workflowDataOptions = {
							displayMember: 'DisplayValue',
							valueMember: 'Id',
							items: state.workflowDataEntities
						};

						$scope.dataTypeOptions = {
							displayMember: 'DisplayValue',
							valueMember: 'Id',
							items: [
								{DisplayValue: $translate.instant('basics.workflow.entityDataAction.create'), Id: 1},
								{DisplayValue: $translate.instant('basics.workflow.entityDataAction.read'), Id: 2},
								{DisplayValue: $translate.instant('basics.workflow.entityDataAction.update'), Id: 3},
								{DisplayValue: $translate.instant('basics.workflow.entityDataAction.delete'), Id: 4}
							]
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						let inputBindings = $scope.action.input;
						let outputBindings = $scope.action.output;

						_.each(inputBindings, function (binding) {
							Object.defineProperty($scope, binding.key, {
								get: function () {
									return basicsWorkflowActionEditorService.getEditorInput(binding.key, $scope.action).value;
								},
								set: function (value) {
									basicsWorkflowActionEditorService.setEditorInput(value, binding.key, $scope.action);
								}
							});
						});

						_.each(outputBindings, function (binding) {
							Object.defineProperty($scope, binding.key, {
								get: function () {
									return basicsWorkflowActionEditorService.getEditorOutput(binding.key, $scope.action).value;
								},
								set: function (value) {
									basicsWorkflowActionEditorService.setEditorOutput(value, binding.key, $scope.action);
								}
							});
						});

						$scope.isUpdate = function isUpdate() {
							return _.find($scope.action.input, {key: 'OperationType'}).value === 3;
						};

						$scope.isCreate = function isCreate() {
							return _.find($scope.action.input, {key: 'OperationType'}).value === 1;
						};
					}
				};
			}
		};
	}

	basicsWorkflowEntityDataEditorDirective.$inject = ['_', 'basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowEntityDataEditorDirective', basicsWorkflowEntityDataEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '08e899fe92774337b2a652d59d142d40',
				directive: 'basicsWorkflowEntityDataEditorDirective',
				prio: null,
				tools: []
			});
		}]);

})(angular);
