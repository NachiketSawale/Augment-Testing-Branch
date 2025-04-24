/**
 * Created by uestuenel on 08.11.2016.
 */

(function (angular) {
	'use strict';

	function basicsWorkflowSaveProjectDocumentContainer(basicsWorkflowEditModes, basicsWorkflowActionEditorService, _, basicsWorkflowActionLookupService, basicsWorkflowSaveProjectDocument) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/save-project-document-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {},
							parameters = basicsWorkflowSaveProjectDocument;

						scope.input = {};
						scope.output = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						scope.input.lookupUrl = 'ProjectDocumentStatus/list';
						scope.input.lookupDocCatUrl = 'ProjectDocumentCategory/list';
						scope.input.lookupPrjDocTypeUrl = 'ProjectDocumentType/list';
						scope.input.overlayLoading = true;

						//set Values for the selectboxes
						function getObjectForSelectBoxes(methodName, displayName) {
							return {
								displayMember: displayName,
								valueMember: 'Id',
								items: [],
								service: basicsWorkflowActionLookupService,
								serviceMethod: methodName,
								serviceReload: true
							};
						}

						scope.selectOptionsStatusId = getObjectForSelectBoxes('getStatusParams', 'DescriptionInfo.Translated');
						scope.selectOptionsCategoryId = getObjectForSelectBoxes('getCategoryParams', 'DescriptionInfo.Translated');
						scope.selectOptionsPrjDocId = getObjectForSelectBoxes('getPrjDocParams', 'DescriptionInfo.Translated');
						scope.selectEstimate = getObjectForSelectBoxes('getEstParams', 'DescriptionInfo.Translated');
						scope.selectSchedule = getObjectForSelectBoxes('getScheduleList', 'DescriptionInfo.Translated');
						scope.selectInformation = getObjectForSelectBoxes('getInfoRequestList', 'Description');

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						function initParsers() {
							var object = {};

							angular.forEach(parameters, function (value) {
								object[value.key] = getDataFromAction(value.actionKey);
							});

							return object;
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								return initParsers();
							}
							return '';
						});

						ngModelCtrl.$render = function () {

							angular.forEach(parameters, function (value) {
								scope.input[value.key] = ngModelCtrl.$viewValue[value.key];

								if (value.editorMode) {
									scope.input[value.key2] = parseInt(ngModelCtrl.$viewValue[value.key]) ? parseInt(ngModelCtrl.$viewValue[value.key]) : null;

									//set radiobutton default
									scope.input[value.editorModeKey] = basicsWorkflowEditModes.default;

									if (basicsWorkflowActionEditorService.setRadioButtonInEditor(scope.input[value.key2], ngModelCtrl.$viewValue[value.key])) {
										scope.input[value.editorModeKey] = basicsWorkflowEditModes.expert;
									}
								}
							});

						};

						ngModelCtrl.$parsers.push(function (value) {

							angular.forEach(parameters, function (item) {
								basicsWorkflowActionEditorService.setEditorInput(value[item.key], item.actionKey, action);
							});

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

						//instead of watches
						scope.input.selectConfig = {
							rt$change: function () {
								saveNgModel();
							},
							change: true
						};

						//for the selectBoxes that depend on the projectId.
						scope.configProcjectId = {
							rt$readonly: function () {
								return scope.input.projectselect > 0 ? false : true;
							},
							rt$change: function () {
								saveNgModel();
							},
							change: true
						};

						scope.lookupOptionsRubricCategory = {
							showClearButton: true,
							filterOptions: {
								serverSide: true,
								fn: function () {
									var documentsRubricId = 40;
									return 'RubricFk = ' + documentsRubricId;
								}
							}
						};
					}
				};
			}
		};
	}

	basicsWorkflowSaveProjectDocumentContainer.$inject = ['basicsWorkflowEditModes', 'basicsWorkflowActionEditorService', '_', 'basicsWorkflowActionLookupService', 'basicsWorkflowSaveProjectDocument'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowSaveProjectDocumentContainer', basicsWorkflowSaveProjectDocumentContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'be5efbabcdc048be8ea3e1dbd222a803',
					directive: 'basicsWorkflowSaveProjectDocumentContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
