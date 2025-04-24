/**
 * Created by baitule on 26.09.2018.
 */
(function (angular) {
	'use strict';

	function basicWorkflowPortalReviewBidderInvitationEmailDirective(basicsWorkflowActionEditorService, _, $translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/portal-review-bidder-invitation-email.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.input = {};
						scope.output = {};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.codeMultiMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);

						scope.isPopUpOptions = {
							ctrlId: 'isPopUpCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.isPopUp')
						};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var recipient = basicsWorkflowActionEditorService.getEditorInput('recipient', action);
								var subject = basicsWorkflowActionEditorService.getEditorInput('subject', action);
								var body = basicsWorkflowActionEditorService.getEditorInput('body', action);
								var isPopUp = basicsWorkflowActionEditorService.getEditorInput('IsPopUp', action);
								var resultCode = basicsWorkflowActionEditorService.getEditorOutput('ResultCode', action);

								return {
									recipient: recipient ? recipient.value : '',
									subject: subject ? subject.value : '',
									body: body ? body.value : '',
									isPopUp: isPopUp ? isPopUp.value : '',
									resultCode: resultCode ? resultCode.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.recipient = ngModelCtrl.$viewValue.recipient;
								scope.input.subject = ngModelCtrl.$viewValue.subject;
								scope.input.body = ngModelCtrl.$viewValue.body;
								scope.input.isPopUp = ngModelCtrl.$viewValue.isPopUp;
								scope.output.resultCode = ngModelCtrl.$viewValue.resultCode;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.recipient, 'recipient', action);
							basicsWorkflowActionEditorService.setEditorInput(value.subject, 'subject', action);
							basicsWorkflowActionEditorService.setEditorInput(value.body, 'body', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isPopUp, 'IsPopUp', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.resultCode, 'ResultCode', action);
							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								recipient: scope.input.recipient,
								subject: scope.input.subject,
								body: scope.input.body,
								isPopUp: scope.input.isPopUp,
								resultCode: scope.output.resultCode
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.changeCheckbox = function () {
							saveNgModel();
						};

						scope.$watch('input.recipient', watchfn);
						scope.$watch('input.subject', watchfn);
						scope.$watch('input.body', watchfn);
						scope.$watch('output.resultCode', watchfn);
					}
				};
			}
		};
	}

	basicWorkflowPortalReviewBidderInvitationEmailDirective.$inject = ['basicsWorkflowActionEditorService', '_', '$translate'];

	angular.module('basics.workflow')
		.directive('basicWorkflowPortalReviewBidderInvitationEmailDirective', basicWorkflowPortalReviewBidderInvitationEmailDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '0000da385c9344f2be9d19913ef2af63',
					directive: 'basicWorkflowPortalReviewBidderInvitationEmailDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
