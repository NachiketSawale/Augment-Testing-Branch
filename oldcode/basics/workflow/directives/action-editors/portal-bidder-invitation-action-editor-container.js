/**
 * Created by baitule on 05.10.2018.
 */
(function (angular) {
	'use strict';

	function basicWorkflowPortalBidderInvitationActionEditorDirective(basicsWorkflowActionEditorService, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/portal-bidder-invitation-action-editor.html',
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
								var portalBaseUrl = basicsWorkflowActionEditorService.getEditorInput('PortalBaseUrl', action);
								var timeToLive = basicsWorkflowActionEditorService.getEditorInput('TimeToLive', action);

								var resultCode = basicsWorkflowActionEditorService.getEditorOutput('ResultCode', action);
								var resultMessage = basicsWorkflowActionEditorService.getEditorOutput('ResultMessage', action);
								var invitationUrl = basicsWorkflowActionEditorService.getEditorOutput('InvitationUrl', action);
								var reInvitationUrl = basicsWorkflowActionEditorService.getEditorOutput('ReInvitationUrl', action);
								var urlValidUntil = basicsWorkflowActionEditorService.getEditorOutput('UrlValidUntil', action);
								var portalInvitationId = basicsWorkflowActionEditorService.getEditorOutput('PortalInvitationId', action);

								return {
									contactId: contactId ? contactId.value : '',
									portalAccessGroupId: portalAccessGroupId ? portalAccessGroupId.value : '',
									portalBaseUrl: portalBaseUrl ? portalBaseUrl.value : '',
									timeToLive: timeToLive ? timeToLive.value : '',

									resultCode: resultCode ? resultCode.value : '',
									resultMessage: resultMessage ? resultMessage.value : '',
									invitationUrl: invitationUrl ? invitationUrl.value : '',
									reInvitationUrl: reInvitationUrl ? reInvitationUrl.value : '',
									urlValidUntil: urlValidUntil ? urlValidUntil.value : '',
									portalInvitationId: portalInvitationId ? portalInvitationId.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.contactId = ngModelCtrl.$viewValue.contactId;
								scope.input.portalAccessGroupId = ngModelCtrl.$viewValue.portalAccessGroupId;
								scope.input.portalBaseUrl = ngModelCtrl.$viewValue.portalBaseUrl;
								scope.input.timeToLive = ngModelCtrl.$viewValue.timeToLive;
								scope.output.resultCode = ngModelCtrl.$viewValue.resultCode;
								scope.output.resultMessage = ngModelCtrl.$viewValue.resultMessage;
								scope.output.invitationUrl = ngModelCtrl.$viewValue.invitationUrl;
								scope.output.reInvitationUrl = ngModelCtrl.$viewValue.reInvitationUrl;
								scope.output.urlValidUntil = ngModelCtrl.$viewValue.urlValidUntil;
								scope.output.portalInvitationId = ngModelCtrl.$viewValue.portalInvitationId;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.contactId, 'ContactId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.portalAccessGroupId, 'PortalAccessGroupId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.portalBaseUrl, 'PortalBaseUrl', action);
							basicsWorkflowActionEditorService.setEditorInput(value.timeToLive, 'TimeToLive', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultCode, 'ResultCode', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultMessage, 'ResultMessage', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.invitationUrl, 'InvitationUrl', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.reInvitationUrl, 'ReInvitationUrl', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.urlValidUntil, 'UrlValidUntil', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.portalInvitationId, 'PortalInvitationId', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								contactId: scope.input.contactId,
								portalAccessGroupId: scope.input.portalAccessGroupId,
								portalBaseUrl: scope.input.portalBaseUrl,
								timeToLive: scope.input.timeToLive,
								resultCode: scope.output.resultCode,
								resultMessage: scope.output.resultMessage,
								invitationUrl: scope.output.invitationUrl,
								reInvitationUrl: scope.output.reInvitationUrl,
								urlValidUntil: scope.output.urlValidUntil,
								portalInvitationId: scope.output.portalInvitationId
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.changedDate = function () {
							saveNgModel();
						};

						scope.$watch('input.contactId', watchfn);
						scope.$watch('input.portalAccessGroupId', watchfn);
						scope.$watch('input.portalBaseUrl', watchfn);
						scope.$watch('input.timeToLive', watchfn);
						scope.$watch('output.resultCode', watchfn);
						scope.$watch('output.resultMessage', watchfn);
						scope.$watch('output.invitationUrl', watchfn);
						scope.$watch('output.reInvitationUrl', watchfn);
						scope.$watch('output.urlValidUntil', watchfn);
						scope.$watch('output.portalInvitationId', watchfn);

					}
				};
			}
		};
	}

	basicWorkflowPortalBidderInvitationActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_'];

	angular.module('basics.workflow')
		.directive('basicWorkflowPortalBidderInvitationActionEditorDirective', basicWorkflowPortalBidderInvitationActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '7DD9E322D1F54F8A90BA1EC6839F7259',
					directive: 'basicWorkflowPortalBidderInvitationActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
