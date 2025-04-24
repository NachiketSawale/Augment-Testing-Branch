/**
 * Created by baitule on 05.10.2018.
 */
(function (angular) {
	'use strict';

	function basicWorkflowPortalConfirmBidderInvitationActionEditorDirective(basicsWorkflowActionEditorService, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/portal-confirm-bidder-invitation-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};

						scope.codeMirrorOptionsSingle = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMirrorOptionsMulti = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var contactId = basicsWorkflowActionEditorService.getEditorInput('ContactId', action);
								var portalAccessGroupId = basicsWorkflowActionEditorService.getEditorInput('PortalAccessGroupId', action);
								var portalInvitationId = basicsWorkflowActionEditorService.getEditorInput('PortalInvitationId', action);
								var portalBaseUrl = basicsWorkflowActionEditorService.getEditorInput('PortalBaseUrl', action);
								var eMailSubject = basicsWorkflowActionEditorService.getEditorInput('EMailSubject', action);
								var eMailBody = basicsWorkflowActionEditorService.getEditorInput('EMailBody', action);
								var eMailRecipients = basicsWorkflowActionEditorService.getEditorInput('EMailRecipients', action);

								var resultCode = basicsWorkflowActionEditorService.getEditorOutput('ResultCode', action);
								var resultMessage = basicsWorkflowActionEditorService.getEditorOutput('ResultMessage', action);
								var confirmed = basicsWorkflowActionEditorService.getEditorOutput('Confirmed', action);

								return {
									contactId: contactId ? contactId.value : '',
									portalAccessGroupId: portalAccessGroupId ? portalAccessGroupId.value : '',
									portalInvitationId: portalInvitationId ? portalInvitationId.value : '',
									portalBaseUrl: portalBaseUrl ? portalBaseUrl.value : '',
									eMailSubject: eMailSubject ? eMailSubject.value : '',
									eMailBody: eMailBody ? eMailBody.value : '',
									eMailRecipients: eMailRecipients ? eMailRecipients.value : '',
									resultCode: resultCode ? resultCode.value : '',
									resultMessage: resultMessage ? resultMessage.value : '',
									confirmed: confirmed ? confirmed.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.contactId = ngModelCtrl.$viewValue.contactId;
								scope.input.portalAccessGroupId = ngModelCtrl.$viewValue.portalAccessGroupId;
								scope.input.portalInvitationId = ngModelCtrl.$viewValue.portalInvitationId;
								scope.input.portalBaseUrl = ngModelCtrl.$viewValue.portalBaseUrl;
								scope.input.eMailSubject = ngModelCtrl.$viewValue.eMailSubject;
								scope.input.eMailBody = ngModelCtrl.$viewValue.eMailBody;
								scope.input.eMailRecipients = ngModelCtrl.$viewValue.eMailRecipients;
								scope.output.resultCode = ngModelCtrl.$viewValue.resultCode;
								scope.output.resultMessage = ngModelCtrl.$viewValue.resultMessage;
								scope.output.confirmed = ngModelCtrl.$viewValue.confirmed;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.contactId, 'ContactId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.portalAccessGroupId, 'PortalAccessGroupId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.portalInvitationId, 'PortalInvitationId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.portalBaseUrl, 'PortalBaseUrl', action);
							basicsWorkflowActionEditorService.setEditorInput(value.eMailSubject, 'EMailSubject', action);
							basicsWorkflowActionEditorService.setEditorInput(value.eMailBody, 'EMailBody', action);
							basicsWorkflowActionEditorService.setEditorInput(value.eMailRecipients, 'EMailRecipients', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultCode, 'ResultCode', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultMessage, 'ResultMessage', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.confirmed, 'Confirmed', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								contactId: scope.input.contactId,
								portalAccessGroupId: scope.input.portalAccessGroupId,
								portalInvitationId: scope.input.portalInvitationId,
								portalBaseUrl: scope.input.portalBaseUrl,
								eMailSubject: scope.input.eMailSubject,
								eMailBody: scope.input.eMailBody,
								eMailRecipients: scope.input.eMailRecipients,
								resultCode: scope.output.resultCode,
								resultMessage: scope.output.resultMessage,
								confirmed: scope.output.confirmed
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.contactId', watchfn);
						scope.$watch('input.portalAccessGroupId', watchfn);
						scope.$watch('input.portalInvitationId', watchfn);
						scope.$watch('input.portalBaseUrl', watchfn);
						scope.$watch('input.eMailSubject', watchfn);
						scope.$watch('input.eMailBody', watchfn);
						scope.$watch('input.eMailRecipients', watchfn);
						scope.$watch('output.resultCode', watchfn);
						scope.$watch('output.resultMessage', watchfn);
						scope.$watch('output.confirmed', watchfn);
					}
				};
			}
		};
	}

	basicWorkflowPortalConfirmBidderInvitationActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_'];

	angular.module('basics.workflow')
		.directive('basicWorkflowPortalConfirmBidderInvitationActionEditorDirective', basicWorkflowPortalConfirmBidderInvitationActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'BAB2A348D8914D338DE04A40D8BC2A35',
					directive: 'basicWorkflowPortalConfirmBidderInvitationActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
