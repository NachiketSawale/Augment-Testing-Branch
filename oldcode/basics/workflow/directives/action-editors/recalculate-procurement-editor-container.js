/**
 * Created by chi on 1/14/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	basicsWorkflowRecalculateProcurementEditorDirective.$inject = ['$translate', 'globals', 'basicsWorkflowEditModes', 'platformModuleStateService', 'basicsWorkflowActionEditorService'];

	function basicsWorkflowRecalculateProcurementEditorDirective($translate, globals, basicsWorkflowEditModes, platformModuleStateService, basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/recalculate-procurement-editor.html',
			compile: function compile() {
				return {
					pre: function postLink($scope, elem, attr, ctrl) {
						var action = {};
						$scope.output = {};
						// accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						// radio-button
						$scope.input = {};
						$scope.input.editorMode = basicsWorkflowEditModes.default;
						$scope.input.radioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
									cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						$scope.onRadioGroupOptChanged = onRadioGroupOptChanged;

						// select box
						var state = platformModuleStateService.state(moduleName);

						$scope.selectOptions = {
							displayMember: 'EntityName',
							valueMember: 'Id',
							items: state.workflowEntities
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						ctrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('IsSuccess', action);
								return {
									id: getDataFromAction('Id'),
									entityName: getDataFromAction('EntityName'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ctrl.$render = function () {
							$scope.input.script = ctrl.$viewValue.id;
							$scope.input.entity = ctrl.$viewValue.entityName !== '' ? ctrl.$viewValue.entityName : 0;
							$scope.input.entityscript = ctrl.$viewValue.entityName;
							$scope.output.property = ctrl.$viewValue.outputValue;

							if (ctrl.$viewValue.entityName && ctrl.$viewValue.entityName !== '' && ctrl.$viewValue.entityName.toString().indexOf('{{') > -1) {
								$scope.input.editorMode = 2;
							}
						};

						ctrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.script, 'Id', action);
							basicsWorkflowActionEditorService.setEditorInput(value.entityName, 'EntityName', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'IsSuccess', action);
							return action;
						});

						$scope.$watch('input.entity', watchfn);
						$scope.$watch('input.script', watchfn);
						$scope.$watch('input.entityscript', watchfn);
						$scope.$watch('output.property', watchfn);

						////////////////
						function onRadioGroupOptChanged(radioValue) {
							$scope.input.editorMode = radioValue;
						}

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								var entityName = $scope.input.editorMode === 1 ? $scope.input.entity : $scope.input.entityscript;

								ctrl.$setViewValue({
									script: $scope.input.script,
									entityName: entityName,
									scriptOutput: $scope.output.property
								});
							}
						}
					}
				};
			}
		};
	}

	angular.module(moduleName)
		.directive('basicsWorkflowRecalculateProcurementEditorDirective', basicsWorkflowRecalculateProcurementEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '60e28279360042f3a265824ace85a9a8',
					directive: 'basicsWorkflowRecalculateProcurementEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);