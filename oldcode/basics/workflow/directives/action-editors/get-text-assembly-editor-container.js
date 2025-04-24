/**
 * Created by chi on 3/10/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.workflow';
	angular.module(moduleName)
		.directive('basicsWorkflowGetTextAssemblyEditorContainer', basicsWorkflowGetTextAssemblyEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '4f81f5d331ac4985aed5dc15833f23a0',
				directive: 'basicsWorkflowGetTextAssemblyEditorContainer',
				prio: null,
				tools: []
			});
		}]);

	basicsWorkflowGetTextAssemblyEditorContainer.$inject = [
		'basicsWorkflowActionEditorService',
		'$translate',
		'_',
		'globals',
		'basicsLookupdataLookupFilterService',
		'basicsWorkflowEditModes'
	];

	function basicsWorkflowGetTextAssemblyEditorContainer(
		basicsWorkflowActionEditorService,
		$translate,
		_,
		globals,
		basicsLookupdataLookupFilterService,
		basicsWorkflowEditModes
	) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-text-assembly-editor.html',
			compile: function () {
				return {
					pre: function (scope, elem, attr, ngModelCtrl) {
						let action = {};
						let filters = [
							{
								key: 'basics-workflow-textmoudle-filter',
								serverSide: true,
								serverKey: 'basics-workflow-textmoudle-filter',
								fn: function () {
									return {};
								}
							}
						];

						_.forEach(filters, function (filter) {
							if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
								basicsLookupdataLookupFilterService.registerFilter(filter);
							}
						});

						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};
						scope.input.editorModeTextModule = basicsWorkflowEditModes.default;
						scope.input.editorModeLanguage = basicsWorkflowEditModes.default;

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.bodyOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						scope.lookupData = {
							textModule: null,
							language: null
						};

						scope.lookupOptions = {
							textModuleId: {
								lookupDirective: 'basics-text-module-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									displayMember: 'Code',
									showClearButton: false,
									readonly: scope.codeMirrorOptions.readOnly,
									filterKey: 'basics-workflow-textmoudle-filter'
								}
							},
							languageId: {
								lookupType: 'basics.customize.language',
								lookupModuleQualifier: 'basics.customize.language',
								valueMember: 'Id',
								displayMember: 'Description',
								eagerLoad: true,
								showClearButton: true,
								readonly: scope.codeMirrorOptions.readOnly
							}
						};

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = parseInt(radioValue);
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								let result = basicsWorkflowActionEditorService.getEditorOutput('Result', action);

								return {
									textModuleId: getDataFromAction('TextModuleId'),
									queryItemId: getDataFromAction('ContextEntityId'),
									languageId: getDataFromAction('DataLanguageId'),

									result: result
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.textModuleId = ngModelCtrl.$viewValue.textModuleId;
								scope.input.queryItemId = ngModelCtrl.$viewValue.queryItemId;
								scope.input.languageId = ngModelCtrl.$viewValue.languageId;

								let textModuleId = +scope.input.textModuleId;
								scope.lookupData.textModule = !_.isNaN(textModuleId) && textModuleId !== 0 ? { Id: textModuleId} : null;

								let languageId = +scope.input.languageId;
								scope.lookupData.language = !_.isNaN(languageId) && languageId !== 0 ? { Id: languageId } : null;

								scope.output.result = ngModelCtrl.$viewValue.result ? ngModelCtrl.$viewValue.result.value : '';
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.textModule ? value.textModule.Id.toString() : (value.textModuleId || '0'), 'TextModuleId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.queryItemId, 'ContextEntityId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.language ? value.language.Id.toString() : (value.languageId || ''), 'DataLanguageId', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.result, 'Result', action);
						});

						function getDataFromAction(key) {
							var param = _.find(action.input, {key: key});

							return param ? param.value : '';
						}

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								textModule: scope.lookupData.textModule,
								textModuleId: scope.input.textModuleId,
								queryItemId: scope.input.queryItemId,
								language: scope.lookupData.language,
								languageId: scope.input.languageId,

								result: scope.output.result
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						function watchTextModuleIdFn(newVal, oldVal) {
							if (newVal !== oldVal) {
								let textModuleId = +newVal;
								scope.lookupData.textModule = !_.isNaN(textModuleId) && textModuleId !== 0 ? { Id: textModuleId} : null;
								saveNgModel();
							}
						}

						function watchTextModuleFn(newVal, oldVal) {
							if (newVal !== oldVal) {
								if (newVal) {
									scope.input.textModuleId = newVal.toString();
								}
								else {
									scope.input.textModuleId = '';
								}

								saveNgModel();
							}
						}

						function watchLanguageIdFn(newVal, oldVal) {
							if (newVal !== oldVal) {
								let languageId = +newVal;
								scope.lookupData.language = !_.isNaN(languageId) && languageId !== 0 ? { Id: languageId} : null;
								saveNgModel();
							}
						}

						function watchLanguageFn(newVal, oldVal) {
							if (newVal !== oldVal) {
								if (newVal) {
									scope.input.languageId = newVal.toString();
								}
								else {
									scope.input.languageId = '';
								}

								saveNgModel();
							}
						}

						scope.$watch('lookupData.textModule.Id', watchTextModuleFn);
						scope.$watch('input.textModuleId', watchTextModuleIdFn);
						scope.$watch('input.queryItemId', watchfn);
						scope.$watch('lookupData.language.Id', watchLanguageFn);
						scope.$watch('input.languageId', watchLanguageIdFn);
						scope.$watch('output.result', watchfn);
					}
				};
			}
		};
	}

})(angular);