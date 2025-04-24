/*globals angular */
(function (angular) {

	'use strict';

	function basicsWorkflowCreateObjectEditorDirective(basicsWorkflowActionEditorService, platformModuleStateService,
	                                                   basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/create-entity-editor.html',
			compile: function compile() {
				return {
					pre: function postLink(scope, iElement, attr, ngModelCtrl) {
						var action = {};

						var state = platformModuleStateService.state('basics.workflow');

						scope.inputOpen = true;
						scope.outputOpen = true;

						function getDataFromAction(key, list) {

							var param = _.find(action[list], {key: key});
							return param ? param.value : '';
						}

						scope.input = {};
						scope.output = {};
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.radioGroupOpt = basicsWorkflowActionEditorService.getRadioGroupOptions($translate);
						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.input.editorMode = radioValue;
						};

						_.each(state.workflowCreateEntities, function (entity) {
							entity.DisplayValue = entity.EntityName + (entity.ModuleName ? ' - ' + entity.ModuleName.toLowerCase() : '');
						});

						scope.onRadioGroupOptChanged('1');
						scope.selectOptions = {
							displayMember: 'DisplayValue',
							valueMember: 'Id',
							items: state.workflowCreateEntities
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								return {
									entityId: getDataFromAction('EntityId', 'input'),
									entityProperty: getDataFromAction('EntityProperty', 'output'),
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.entityId = ngModelCtrl.$viewValue.entityId;
								scope.output.entityProperty = ngModelCtrl.$viewValue.entityProperty;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.entityId, 'EntityId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.entityProperty, 'EntityProperty', action);
							return action;
						});

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								updateViewModel();
							}
						}

						function updateViewModel() {
							ngModelCtrl.$setViewValue({
								entityId: scope.input.entityId,
								entityProperty: scope.output.entityProperty
							});
						}

						scope.$watch('input.entityId', watchfn);
						scope.$watch('output.entityProperty', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowCreateObjectEditorDirective.$inject = ['basicsWorkflowActionEditorService',
		'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow').directive('basicsWorkflowCreateObjectEditorDirective', basicsWorkflowCreateObjectEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '2aa3606385474ad48ca61bc9aea21d05',
					directive: 'basicsWorkflowCreateObjectEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
