/* globals angular*/

(function (angular) {
	'use strict';

	function basicsWorkflowGetObjectEditorDirective(basicsWorkflowActionEditorService, platformModuleStateService, basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-object-editor.html',
			compile: function compile() {
				return {
					pre: function postLink($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.output = {};
						//accordion
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						//radio-button
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

						$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							$scope.input.editorMode = radioValue;
						};

						//selectbox
						var state = platformModuleStateService.state('basics.workflow');

						_.each(state.workflowEntities, function (entity) {
							entity.DisplayValue = entity.EntityName + (entity.ModuleName ? ' - ' + entity.ModuleName.toLowerCase() : '');
						});

						$scope.selectOptions = {
							displayMember: 'DisplayValue',
							valueMember: 'Id',
							items: state.workflowEntities
						};

						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('EntityProperty', action);

								return {
									id: getDataFromAction('Id'),
									entityName: getDataFromAction('EntityName'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							$scope.input.script = ngModelCtrl.$viewValue.id;
							$scope.input.entity = ngModelCtrl.$viewValue.entityName !== '' ? ngModelCtrl.$viewValue.entityName : 0;
							$scope.input.entityscript = ngModelCtrl.$viewValue.entityName;
							$scope.output.property = ngModelCtrl.$viewValue.outputValue;

							if (ngModelCtrl.$viewValue.entityName && ngModelCtrl.$viewValue.entityName !== '' && ngModelCtrl.$viewValue.entityName.toString().indexOf('{{') > -1) {
								$scope.input.editorMode = 2;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.script, 'Id', action);
							basicsWorkflowActionEditorService.setEditorInput(value.entityName, 'EntityName', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'EntityProperty', action);

							return action;
						});

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								var entityName = $scope.input.editorMode === 1 ? $scope.input.entity : $scope.input.entityscript;

								ngModelCtrl.$setViewValue({
									script: $scope.input.script,
									entityName: entityName,
									scriptOutput: $scope.output.property
								});
							}
						}

						$scope.$watch('input.entity', watchfn);
						$scope.$watch('input.script', watchfn);
						$scope.$watch('input.entityscript', watchfn);
						$scope.$watch('output.property', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowGetObjectEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService', 'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetObjectEditorDirective', basicsWorkflowGetObjectEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '7fd3d8bc9e77497399849816d295e615',
					directive: 'basicsWorkflowGetObjectEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
