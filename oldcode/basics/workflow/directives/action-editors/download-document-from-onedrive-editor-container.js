/**
 * Created by chd on 01.04.2022.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	function basicsWorkflowDownloadDocFromOneDriveEditorDirective(basicsWorkflowActionEditorService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/download-document-from-onedrive-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						let action = {};

						// accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.model = {};
						scope.input = {};
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.output = {};

						function getDataFromAction(key) {
							let param = _.find(action.input, {key: key});

							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								let result = basicsWorkflowActionEditorService.getEditorOutput('Archive', action);

								return {
									archiveIds: getDataFromAction('ArchiveIds'),
									archive: result ? result.value : '',
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.archiveIds = ngModelCtrl.$viewValue.archiveIds;
								scope.output.archive = ngModelCtrl.$viewValue.archive;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.archiveIds, 'ArchiveIds', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.archive, 'Archive', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								archiveIds: scope.input.archiveIds,
								archive: scope.output.archive
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.archiveIds', watchfn);
						scope.$watch('output.archive', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowDownloadDocFromOneDriveEditorDirective.$inject = ['basicsWorkflowActionEditorService'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowDownloadDocFromOneDriveEditorDirective', basicsWorkflowDownloadDocFromOneDriveEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'abca63299da7471198f5115219c779d1',
					directive: 'basicsWorkflowDownloadDocFromOneDriveEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
