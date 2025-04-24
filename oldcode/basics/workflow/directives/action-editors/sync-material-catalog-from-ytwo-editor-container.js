/**
 * Created by baitule on 18.10.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowSyncMaterialCatalogFromYtwoEditorContainer(_, basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/sync-material-catalog-from-ytwo-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.input = {};
						scope.output = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						function getDataFromAction(key) {
							var param = _.find(action.input, {key: key});
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {

								var updatedMaterialCatalogIds = basicsWorkflowActionEditorService.getEditorOutput('UpdatedMaterialCatalogIds', action);
								var errorMessage = basicsWorkflowActionEditorService.getEditorOutput('ErrorMessage', action);
								var warningMessage = basicsWorkflowActionEditorService.getEditorOutput('WarningMessage', action);

								return {
									materialCatalogCodes: getDataFromAction('MaterialCatalogCodes'),
									language: getDataFromAction('Language'),
									updatedMaterialCatalogIds: updatedMaterialCatalogIds ? updatedMaterialCatalogIds.value : '',
									errorMessage: errorMessage ? errorMessage.value : '',
									warningMessage: warningMessage ? warningMessage.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							scope.input.materialCatalogCodes = ngModelCtrl.$viewValue.materialCatalogCodes;
							scope.input.language = ngModelCtrl.$viewValue.language;
							scope.output.updatedMaterialCatalogIds = ngModelCtrl.$viewValue.updatedMaterialCatalogIds;
							scope.output.errorMessage = ngModelCtrl.$viewValue.errorMessage;
							scope.output.warningMessage = ngModelCtrl.$viewValue.warningMessage;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.materialCatalogCodes, 'MaterialCatalogCodes', action);
							basicsWorkflowActionEditorService.setEditorInput(value.language, 'Language', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.updatedMaterialCatalogIds, 'UpdatedMaterialCatalogIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.errorMessage, 'ErrorMessage', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.warningMessage, 'WarningMessage', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								materialCatalogCodes: scope.input.materialCatalogCodes,
								language: scope.input.language,
								updatedMaterialCatalogIds: scope.output.updatedMaterialCatalogIds,
								errorMessage: scope.output.errorMessage,
								warningMessage: scope.output.warningMessage
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.materialCatalogCodes', watchfn);
						scope.$watch('input.language', watchfn);
						scope.$watch('output.updatedMaterialCatalogIds', watchfn);
						scope.$watch('output.errorMessage', watchfn);
						scope.$watch('output.warningMessage', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowSyncMaterialCatalogFromYtwoEditorContainer.$inject = ['_', 'basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowSyncMaterialCatalogFromYtwoEditorContainer', basicsWorkflowSyncMaterialCatalogFromYtwoEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push({
				actionId: '74FC8C56284C4307817B866A35479E79',
				directive: 'basicsWorkflowSyncMaterialCatalogFromYtwoEditorContainer',
				prio: null,
				tools: []
			});
		}]);
})(angular);
