/**
 * Created by uestuenel on 11.07.2016.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowMailReportActionEditorDirective(basicsWorkflowActionEditorService, platformGridAPI,
	                                                       platformCreateUuid, basicsWorkflowEditModes, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/mail-report-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};
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

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model, event) {
							scope.input[model] = radioValue;

							if (event && radioValue === '1') {
								var gridElement = angular.element(event.target).parents('.radiolist-container').parent().find('.platformgrid');
								setTimeout(function () {
									platformGridAPI.grids.resize(gridElement.attr('id'));
								}, 0);
							}
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.saveMailOptions = {
							ctrlId: 'saveMailCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.mail.saveMail')
						};

						scope.credentialsOptions = {
							ctrlId: 'credentialsOptions',
							labelText: $translate.instant('basics.workflow.action.customEditor.mail.useDefaultCredentials')
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var from = basicsWorkflowActionEditorService.getEditorInput('From', action);
								var subject = basicsWorkflowActionEditorService.getEditorInput('Subject', action);
								var docId = basicsWorkflowActionEditorService.getEditorOutput('DocId', action);
								var saveMail = basicsWorkflowActionEditorService.getEditorInput('SaveMail', action);
								var useDefaultCredentials = basicsWorkflowActionEditorService.getEditorInput('UseDefaultCredentials', action);

								return {
									contentFrom: from ? from.value : '',
									contentSubj: subject ? subject.value : '',
									docId: docId ? docId.value : '',
									saveMail: saveMail ? saveMail.value : '',
									useDefaultCredentials: useDefaultCredentials.value
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.from = ngModelCtrl.$viewValue.contentFrom;
								scope.input.sub = ngModelCtrl.$viewValue.contentSubj;
								scope.input.saveMail = ngModelCtrl.$viewValue.saveMail;
								scope.input.useDefaultCredentials = ngModelCtrl.$viewValue.useDefaultCredentials;
								scope.output.docId = ngModelCtrl.$viewValue.docId;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.from, 'From', action);
							basicsWorkflowActionEditorService.setEditorInput(value.sub, 'Subject', action);
							basicsWorkflowActionEditorService.setEditorInput(value.saveMail, 'SaveMail', action);
							basicsWorkflowActionEditorService.setEditorInput(value.useDefaultCredentials, 'UseDefaultCredentials', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.docId, 'DocId', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								from: scope.input.from,
								sub: scope.input.sub,
								saveMail: scope.input.saveMail,
								useDefaultCredentials: scope.input.useDefaultCredentials,
								docId: scope.output.docId
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.changeCheckbox = function () {
							saveNgModel();
						};

						scope.$watch('input.from', watchfn);
						scope.$watch('input.sub', watchfn);
						scope.$watch('input.useDefaultCredentials', watchfn);
						scope.$watch('output.docId', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowMailReportActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', 'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowMailReportActionEditorDirective', basicsWorkflowMailReportActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'ece96a96aab44036af3dafcf20fc4f3d',
					directive: 'basicsWorkflowMailReportActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
