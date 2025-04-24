/**
 * Created by jie on 12.30.2021.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowCreateCheckListEditorContainer(basicsWorkflowActionEditorService, platformModuleStateService, basicsWorkflowEditModes, $translate, basicsWorkflowHsqeCheckListService, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/hsqe-create-checklist-editor.html',
			compile: () => {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var state = platformModuleStateService.state('basics.workflow');

						var action = {},parameters = basicsWorkflowHsqeCheckListService;
						scope.output = {};
						scope.model = {};
						scope.input = {};
						scope.config = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.fromCheckListTemplate= 1;
						scope.input.createCheckListFlg = 1;
						scope.input.createDistinctChecklist = true;
						scope.input.checkListTemplateId = null;
						scope.input.projectFk = null;
						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							// if(key==='fromCheckListTemplate'){
							// 	return  1;
							// }
							return param ? param.value : '';
						}
						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('id', action);
								// return initParsers();
								return {
									checkListTemplateId: getDataFromAction('CheckListTemplateId'),
									fromCheckListTemplate: getDataFromAction('FromCheckListTemplate'),
									createCheckListFlg:getDataFromAction('CreateCheckListFlg'),
									projectFk: getDataFromAction('ProjectFk'),
									createDistinctChecklist: getDataFromAction('CreateDistinctChecklist'),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {

							angular.forEach(parameters, function (value) {
								scope.input[value.key] = ngModelCtrl.$viewValue[value.key];
								scope.output.id = ngModelCtrl.$viewValue.outputValue;
							});
						};

						ngModelCtrl.$parsers.push(function (value) {
							angular.forEach(parameters, function (item) {
								basicsWorkflowActionEditorService.setEditorInput(value[item.key], item.actionKey, action);
							});
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'id', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue(parseModel());
						}

						function parseModel() {
							var object = {};

							angular.forEach(parameters, function (value) {
								if (value.editorMode) {
									object[value.key] = scope.input[value.editorModeKey] === 2 ? scope.input[value.key] : scope.input[value.key2];
								} else {
									object[value.key] = scope.input[value.key];
								}
								object['scriptOutput'] = scope.output['id'];
							});

							return object;
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.lookupOptions = {
							showClearButton: true
						};

						angular.forEach(parameters, function (value) {
							if (!value.lookup) {
								scope.$watch('input.' + value.key, watchfn);
							}
						});

						scope.$watch('output.id', watchfn);

						scope.input.selectConfig = {
							rt$change: function () {
								saveNgModel();
							},
							change: true
						};

						scope.configProcjectId = {
							rt$readonly: function () {
								return scope.input.projectselect > 0 ? false : true;
							},
							rt$change: function () {
								saveNgModel();
							},
							change: true
						};
					}
				};
			}
		};
	}


	basicsWorkflowCreateCheckListEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate', 'basicsWorkflowHsqeCheckListService', '_'];
	angular.module('basics.workflow')
		.directive('basicsWorkflowCreateCheckListEditorContainer', basicsWorkflowCreateCheckListEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '5688AAC75C4349D3B5AC558C7AB551E7',
					directive: 'basicsWorkflowCreateCheckListEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);