/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('model.main')
		.directive('modelMainModifyPropertiesActionEditorContainer', ['_', 'platformCreateUuid',
			'basicsWorkflowGlobalContextUtil', 'basicsWorkflowActionEditorService', 'platformGridAPI', '$log',
			function workflowDirective(_, platformCreateUuid, basicsWorkflowGlobalContextUtil,
			                           basicsWorkflowActionEditorService, platformGridAPI, $log) {
				return {
					restrict: 'A',
					templateUrl: globals.appBaseUrl + 'model.main/templates/workflow-editors/model-main-modify-properties-action-editor.html',
					compile: function () {
						return {
							pre: function (scope) {
								var objectsParam = 'Objects';
								var propertyChangesParam = 'PropertyChanges';

								scope.input = {
									objects: basicsWorkflowActionEditorService.getEditorInput(objectsParam, scope.action).value,
									propertyChanges: {
										Values: (function initializePropertyChanges() {
											var rawValue = basicsWorkflowActionEditorService.getEditorInput(propertyChangesParam, scope.action).value;
											if (_.isString(rawValue) && !_.isEmpty(rawValue)) {
												try {
													var result = JSON.parse(rawValue);
													if (_.isArray(result)) {
														result.forEach(function (item, index) {
															item.id = index;
														});
														return result;
													}
												} catch (ex) {
													$log.error(ex);
												}
											}
											return [];
										})()
									}
								};

								scope.$watch('input.objects', function objectsUpdated(newValue, oldValue) {
									if (newValue !== oldValue) {
										basicsWorkflowActionEditorService.setEditorInput(newValue, objectsParam, scope.action);

										basicsWorkflowActionEditorService.updateEditorOutputFromInput(oldValue, newValue, scope.output, 'objects');
									}
								});

								scope.$watch('input.propertyChanges.Values', function (newValue, oldValue) {
									if (!angular.equals(newValue, oldValue)) {
										basicsWorkflowActionEditorService.setEditorInput(JSON.stringify(newValue), propertyChangesParam, scope.action);
									}
								}, true);

								scope.output = {
									objects: basicsWorkflowActionEditorService.getEditorOutput(objectsParam, scope.action).value
								};

								scope.$watch('output.objects', function objectsUpdated(newValue, oldValue) {
									if (newValue !== oldValue) {
										basicsWorkflowActionEditorService.setEditorOutput(newValue, objectsParam, scope.action);
									}
								});

								scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

								//accordion
								scope.inputOpen = true;
								scope.outputOpen = true;
							}
						};
					}
				};
			}])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '0415b6308da9432e982b880c8348cc87',
					directive: 'modelMainModifyPropertiesActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
