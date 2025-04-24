/**
 * Created by hzh on 9/18/2019.
 */
(function (angular) {
	'use strict';

	var serviceName = 'basicsWorkflowApproverAction';

	function ApprovedAction() {
		var self = this;
		self.Id = '0000f7032fb24660ba278e52126249be';
		// self.Input = ['HTML', 'Script','Context','IsPopUp', 'Title', 'Subtitle', 'DialogConfig'];
		self.Input = ['Config', 'IsPopUp', 'EvaluateProxy','AllowReassign','EscalationDisabled', 'Context'];
		self.Output = ['Context'];
		self.Description = 'Approver Action';
		self.ActionType = 6;
		self.HideFooter = true;
		self.templateUrl = '';
		self.directive = 'basicsWorkflowApproverActionDirective';
		self.Namespace = 'Basics.Workflow';

		self.initScope = function (scope, item, $compile, $templateCache) {
			scope.OnApprAddCount = function () {
				scope.Context.ApprovalUserInfo.ApprovalClerkSelection.NodeCount = parseInt(scope.Context.ApprovalUserInfo.ApprovalClerkSelection.NodeCount) + 1;

				getApprovalUi(scope, $compile, $templateCache);
			};

			scope.OnApprMinusCount = function () {
				if (scope.Context.ApprovalUserInfo.ApprovalClerkSelection.NodeCount > 0) {
					scope.Context.ApprovalUserInfo.ApprovalClerkSelection.NodeCount = scope.Context.ApprovalUserInfo.ApprovalClerkSelection.NodeCount - 1;

					getApprovalUi(scope, $compile, $templateCache);
				}
			};

			scope.OnApprKeyPressCount = function ($event) {
				if ($event.keyCode < 48 || $event.keyCode > 57) {
					$event.preventDefault();
				}
			};

			scope.OnApprKeyUp = function () {
				getApprovalUi(scope, $compile, $templateCache);
			};

			scope.OnApprChange = function () {
				getApprovalUi(scope, $compile, $templateCache);
			};

			function getApprovalUi(scope, $compile, $templateCache) {
				var nodeCount = scope.Context.ApprovalUserInfo.ApprovalClerkSelection.NodeCount;
				if (nodeCount !== '') {

					var levelCount = angular.element(document).find(jQuery($('div[id^="Level"]'))).length;
					if (levelCount > nodeCount) {
						var diff = levelCount - nodeCount;
						while (diff > 0) {
							jQuery($('div[id^="Level"]')).last().remove();
							var attr = 'Nodes' + (levelCount - diff);
							delete scope.Context.ApprovalUserInfo.ApprovalClerkSelection[attr];
							diff--;
						}
					} else {
						var elem = angular.element('#div_approve');
						var htmlUrl = 'basics.workflow/approver-level-action.html';
						var html = $templateCache.get(htmlUrl);

						for (var i = levelCount; i < nodeCount; i++) {
							var template = html;
							while (template.indexOf('{{approve_level}}') > -1) {
								template = template.replace('{{approve_level}}', i)
									.replace('{{node_level}}', i + 1);
							}
							elem.append($compile(template)(scope));
						}
					}
				}
			}

			scope.GetApprUI = getApprovalUi;

			scope.OnCcAddCount = function () {
				scope.Context.ApprovalUserInfo.CcSelection.NodeCount = parseInt(scope.Context.ApprovalUserInfo.CcSelection.NodeCount) + 1;

				getCcUI(scope, $compile, $templateCache);
			};

			scope.OnCcMinusCount = function () {
				if (scope.Context.ApprovalUserInfo.CcSelection.NodeCount > 0) {
					scope.Context.ApprovalUserInfo.CcSelection.NodeCount = scope.Context.ApprovalUserInfo.CcSelection.NodeCount - 1;

					getCcUI(scope, $compile, $templateCache);
				}
			};

			scope.OnCcKeyPressCount = function ($event) {
				if ($event.keyCode < 48 || $event.keyCode > 57) {
					$event.preventDefault();
				}
			};

			scope.OnCcKeyUp = function () {
				getCcUI(scope, $compile, $templateCache);
			};

			scope.OnCcChange = function () {
				getCcUI(scope, $compile, $templateCache);
			};

			function getCcUI(scope, $compile, $templateCache) {
				var nodeCount = scope.Context.ApprovalUserInfo.CcSelection.NodeCount;
				if (nodeCount !== '') {
					var levelCount = angular.element(document).find(jQuery($('div[id^="Cc"]'))).length;
					if (levelCount > nodeCount) {
						var diff = levelCount - nodeCount;
						while (diff > 0) {
							jQuery($('div[id^="Cc"]')).last().remove();
							var attr = 'Nodes' + (levelCount - diff);
							delete scope.Context.ApprovalUserInfo.CcSelection[attr];
							diff--;
						}
					} else {
						var elem = angular.element('#div_cc');
						var htmlUrl = 'basics.workflow/cc-level-action.html';
						var html = $templateCache.get(htmlUrl);
						for (var i = levelCount; i < nodeCount; i++) {
							var template = html;
							while (template.indexOf('{{approve_level}}') > -1) {
								template = template.replace('{{approve_level}}', i)
									.replace('{{node_level}}', i + 1);
							}
							elem.append($compile(template)(scope));
						}
					}
				}
			}

			scope.GetCcUI = getCcUI;

			if (scope.Context.ApprovalUserInfo.ApprovalClerkSelection !== undefined) {
				var approveRealCount = Object.keys(scope.Context.ApprovalUserInfo.ApprovalClerkSelection).length;
				if (approveRealCount > 1) {
					scope.Context.ApprovalUserInfo.ApprovalClerkSelection.NodeCount = approveRealCount - 1;
				}
			}

			if (scope.Context.ApprovalUserInfo.CcSelection !== undefined) {
				var CcRealCount = Object.keys(scope.Context.ApprovalUserInfo.CcSelection).length;
				if (CcRealCount > 1) {
					scope.Context.ApprovalUserInfo.CcSelection.NodeCount = CcRealCount - 1;
				}
			}

			getApprovalUi(scope, $compile, $templateCache);
			getCcUI(scope, $compile, $templateCache);
		};
	}

	angular.module('basics.workflow').service(serviceName,
		['platformModalService', '$translate', ApprovedAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);

})(angular);