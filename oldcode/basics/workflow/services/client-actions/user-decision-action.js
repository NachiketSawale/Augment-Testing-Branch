/* globals angular*/
(function () {
	'use strict';

	var serviceName = 'basicsWorkflowUserDecisionAction';

	function UserDecisionAction(_, basicsWorkflowUtilityService) {
		var self = this;
		self.Id = '00000000000000000000000000000001';
		self.Input = ['Config', 'IsPopUp'];
		self.Output = ['Context'];
		self.Description = 'User Decision';
		self.ActionType = 3;
		self.directive = 'basicsWorkflowUserInputActionDirective';
		self.Namespace = 'Basics.Workflow';
		self.initScope = async function (scope, task) {
			if(!task.IsContextLoaded) {
				await basicsWorkflowUtilityService.loadContext(task);
			}
			scope.config = angular.fromJson(task.input[0].value);
			scope.value = {};
			_.each(scope.config, function (item) {
				if (item.context) {
					scope.value[item.context] = item.value;
				}
			});
		};

		/**
		 * Sets default values for user decision task when it is opened in the sidebar/popup.
		 */
		self.setDefaultValues = basicsWorkflowUtilityService.setDefaultValuesForUserDecision;

		self.updateContext = function (context, scope) {
			_.each(scope.config, function (item) {
				if (item.context) {
					basicsWorkflowUtilityService.setObjectDeep(context, item.context, scope.value[item.context], true);
				}
			});
		};
	}

	angular.module('basics.workflow').service(serviceName, ['_', 'basicsWorkflowUtilityService', UserDecisionAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})();
