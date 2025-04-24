/* globals angular */
(function () {
	'use strict';

	/**
	 *
	 * @param _
	 * @param cloudDesktopSidebarService
	 * @param $state
	 * @param basicsWorkflowModuleUtilServivce
	 * @returns {{restrict: string, require: string, compile: compile, templateUrl: string}}
	 */
	function usermanagementReviewEmailClientActionDirective(_, cloudDesktopSidebarService, $state, basicsWorkflowClientActionUtilService) {  // jshint ignore:line

		return {
			restrict: 'A',
			require: 'ngModel',
			compile: function () {
				return {
					pre: preLink,
					post: postLink
				};
			},
			templateUrl: 'usermanagement.user/templates/portal-review-email-clientaction.html'
		};

		function provideTranslationOrDefault(key, fallback) {
			var res = $translate.instant(key);

			if (res === key) {
				res = fallback;
			}

			return res;
		}

		/**
		 * Update contactId Output variable with latest value
		 */
		function setResultCodetoOutput(scope, resultCode) {

			// scope.response.Context[scope.response.task.output[0].value] = selContactId;
			// very strange, ask Chris Knickenberg why
			if (!scope.response.Context.hasOwnProperty('Context')) {
				scope.response.Context.Context = {};
			}
			scope.response.Context.Context[scope.response.task.output[0].value] = resultCode;
		}

		function preLink(scope /* , iElement, attrs, ngModelCtrl */) {

			// prepare scope data, must be palced here !!!
			scope.data = {
				sendemail: 1
			};

			var sendemailoptions = {
				displayMember: 'desc', valueMember: 'key',
				items: [{key: 0, desc: provideTranslationOrDefault('cloud.common.abortSendingEmailToBidder', 'Abort Sending Email to Bidder')},
					{key: 1, desc: provideTranslationOrDefault('cloud.common.sendEmailToBidder', 'Send Email to Bidder')}],
			};

			scope.onChangeSendEmail = function onChangeSendEmail() {
				if (scope.data.sendemail === 1) {
					setResultCodetoOutput(scope, 200);
				} else {
					setResultCodetoOutput(scope, 500);
				}
			};

			var subTitleTask = provideTranslationOrDefault('cloud.common.pleaseCheckTheFollowingEMail',
				'Please check the following EMail!');
			var subTitleInfo = provideTranslationOrDefault('cloud.common.itWillBeSendToTheBidderAsInvitationMail',
				'It will be send to the Bidder as Invitation Mail.');
			var eMailBody = provideTranslationOrDefault('cloud.common.eMailBody',
				'Email Body:');

			scope.dlgOptions = {
				recipient: provideTranslationOrDefault('cloud.common.recipient', 'Recipient'),
				body: '<b>' + eMailBody + '</b><br>',
				subject: provideTranslationOrDefault('cloud.common.subject', 'Subject'),
				subtitle: '<b>' + subTitleTask + '</b><br>' + subTitleInfo,
				sendemail: provideTranslationOrDefault('cloud.common.pleaseSelectFurtherAction', 'Please select further Action'),
				sendemailoptions: sendemailoptions
			};

		}

		/**
		 *
		 * @param scope
		 * @param iElement
		 * @param attrs
		 * @param ngModelCtrl
		 */
		function postLink(scope, iElement, attrs, ngModelCtrl) {
			// parameter
			// self.Input = ['recipient','subject','body'];
			// self.Output = ['Context'];
			var inputPar1 = 'recipient';
			var inputPar2 = 'subject';
			var inputPar3 = 'body';
			var outputPar1 = 'ResultCode';

			function validateParams(response) {
				// validate input and output parameters
				var valid = true;
				var errMsg = [];
				if (response.task.input) {
					if (response.task.input[0] && response.task.input[1] && response.task.input[2]) {
						if (!((response.task.input[0].key === inputPar1) && _.isString(response.task.input[0].value))) {
							errMsg.push('Parameter: ' + inputPar1 + ' is missing or having none valid value');
							valid = false;
						}
						if (!((response.task.input[1].key === inputPar2) && _.isString(response.task.input[1].value))) {
							errMsg.push('Parameter: ' + inputPar2 + ' is missing or having none valid value');
							valid = false;
						}
						if (!((response.task.input[2].key === inputPar3) && _.isString(response.task.input[2].value))) {
							errMsg.push('Parameter: ' + inputPar3 + ' is missing or having none valid value');
							valid = false;
						}
					} else {
						errMsg.push('no Input Parameters found');
						valid = false;
					}
					if (response.task.output[0]) {
						if (!((response.task.output[0].key === outputPar1) && _.isString(response.task.output[0].value))) {
							errMsg.push('Output Parameter: ' + outputPar1 + ' is missing, required destination definition');
							valid = false;
						}
					} else {
						errMsg.push('not Output Parameters found');
						valid = false;
					}
				} else {
					errMsg.push('not Parameters found');
					valid = false;
				}
				return {valid: valid, error: _.join(errMsg, '<br>')};
			}

			/**
			 *
			 */
			ngModelCtrl.$render = async function () {
				await basicsWorkflowClientActionUtilService.initScope(scope, ngModelCtrl);
				// save ngmodel into scope
				scope.response = ngModelCtrl.$viewValue;

				// validate input and output parameters
				var validated = validateParams(scope.response);

				if (!validated.valid) {
					scope.parameterInvalid = true;
					scope.parameterInvalidInfo = validated;
					return;
				}
				// param1 'subtitle') {
				scope.data.recipient = scope.response.task.input[0].value; // JSON.parse(scope.response.task.input[0].value);
				// param2 'subject'
				scope.data.subject = scope.response.task.input[1].value;// JSON.parse(scope.response.task.input[1].value);
				// param2 'body'
				scope.data.body = scope.response.task.input[2].value;// JSON.parse(scope.response.task.input[2].value);

				// set default PortalAccessGroupId
				// setPortalAccessGroupIdtoOutput(scope.data.extProviderInfo.FrmPortalUserGroupFk);
			};

			setResultCodetoOutput(scope, 200);

			scope.$watch(function () {
				return scope.response;
			}, function (newVal, oldVal) {
				if (newVal && newVal !== oldVal) {
					ngModelCtrl.$setViewValue(scope.response);
				}
			}, true);
		}
	}

	usermanagementReviewEmailClientActionDirective.$inject = ['_', 'cloudDesktopSidebarService', '$state', 'basicsWorkflowClientActionUtilService'];
	angular.module('businesspartner.main')
		.directive('usermanagementReviewEmailClientActionDirective', usermanagementReviewEmailClientActionDirective);

})(angular);
