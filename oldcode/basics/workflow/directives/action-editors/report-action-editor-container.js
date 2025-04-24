/**
 * Created by uestuenel on 10.06.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowReportActionEditorContainer(basicsWorkflowActionEditorService, platformGridAPI,
	                                                   platformCreateUuid, _, basicsWorkflowReportUtilsService, basicsWorkflowEditModes, $translate, $timeout,
	                                                   basicsWorkflowReportFilename) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/report-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.input = {};

						scope.input.radioGroupOpt = {
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

						//selectbox filename
						scope.selectOptions = {
							displayMember: 'description',
							valueMember: 'id',
							items: basicsWorkflowReportFilename
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var exportData = getContentFromModel('ExportType', value);
								var fileData = getContentFromModel('FilenName', value);

								//one output parameter 'DocId'
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('DocId', action);

								return {
									exportData: exportData,
									fileData: fileData,
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						//get datas from ngModel
						function getContentFromModel(key, value) {
							var param = _.find(value.input, {key: key});

							return param ? param.value : '';
						}

						ngModelCtrl.$render = function () {
							scope.input.export = ngModelCtrl.$viewValue.exportData;
							scope.input.file = ngModelCtrl.$viewValue.fileData;

							//render output parameters
							scope.output.report = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.exportData, 'ExportType', action);
							basicsWorkflowActionEditorService.setEditorInput(value.fileData, 'FilenName', action);

							//save output parameter
							basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'DocId', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								exportData: scope.input.export,
								fileData: scope.input.file,
								scriptOutput: scope.output.report
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.file', watchfn);
						scope.$watch('input.export', watchfn);
						scope.$watch('output.report', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowReportActionEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', '_', 'basicsWorkflowReportUtilsService', 'basicsWorkflowEditModes', '$translate',
		'$timeout', 'basicsWorkflowReportFilename'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowReportActionEditorContainer', basicsWorkflowReportActionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '7babb1069b434937ab6237787f4c2e21',
					directive: 'basicsWorkflowReportActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}])
		.value('basicsWorkflowReportFilename', {
			csv: {
				description: 'CSV',
				id: 'csv'
			},
			docx: {
				description: 'DOCX',
				id: 'docx'
			},
			html: {
				description: 'HTML',
				id: 'html'
			},
			pdf: {
				description: 'PDF',
				id: 'pdf'
			},
			rtf: {
				description: 'RTF',
				id: 'rtf'
			},
			txt: {
				description: 'TXT',
				id: 'txt'
			},
			xlsx: {
				description: 'XLSX',
				id: 'xlsx'
			}
		});
})(angular);
