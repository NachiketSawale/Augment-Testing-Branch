/**
 * Created by xai on 8/18/2017.
 */
(function () {
	'use strict';

	var serviceName = 'basicsWorkflowUserDecisionExAction';

	function UserDecisionExAction(_, basicsWorkflowUtilityService, platformDialogService) {
		var self = this;
		self.Id = '00000CB98D9A4C87A6504C5313080EB9';
		self.Input = ['Config', 'IsPopUp', 'IsNotification'];
		self.Output = ['Context'];
		self.Description = 'User Decision Ex';
		self.ActionType = 3;
		self.directive = 'basicsWorkflowUserInputActionDirective';
		self.Namespace = 'Basics.Workflow';
		self.execute = function (task) {

			var templateUrl = 'basics.workflow/clientActionDialog.html';
			var contextProp = _.find(task.Output, {key: 'Context'});
			if (contextProp) {
				var contextValue = contextProp.value;
				if (contextValue === 1) {
					templateUrl = 'basics.workflow/TermsConditionDialog.html';
				}
			}
			var myDialogOptions = {
				templateUrl: templateUrl,
				backdrop: false,
				headerText: task.Description,
				subHeaderText: task.Comment,
				showOkButton: true,
				showCancelButton: true,
				controller: ['$scope', '$modalInstance', function basicsWorkflowVersionValidationController($scope, $modalInstance) {
					$scope.task = task;
					$scope.modalOptions = myDialogOptions;
					$scope.onOk = function onOk() {
						$modalInstance.close({
							data: {
								task: $scope.task,
								context: $scope.task.Context,
								result: 'true'
							}
						});

					};
					$scope.onCancel = function onCancel() {
						$modalInstance.close({
							data: {
								task: $scope.task,
								context: $scope.task.Context,
								result: 'false'
							},
							cancel: true
						});

					};
					$scope.CheckTermsConditions = function CheckTermsConditions() {
						if ($scope.task.Context) {
							var termsCheck;
							if ($scope.task.Context.Context) {
								termsCheck = $scope.task.Context.Context.output;
								if (termsCheck) {
									return false;
								}
							} else {
								termsCheck = $scope.task.Context.output;
								if (termsCheck) {
									return false;
								}
							}
						}
						return true;
					};
				}]
			};

			// very important the result must be a response with a data property and the that property must have a context
			// the context has a property named like your Output Property.
			return platformDialogService.showDialog(myDialogOptions).then(function (response) {
				let result = {data: {task: task, context: task.context, result: response.data.result}};
				if(response.cancel) {
					result = {...result, cancel: response.cancel}
				}
				return result;
			}, function () {
				return {data: {task: task, context: task.context, result: 'false'}, cancel: true};
			});
		};
		self.initScope = function (scope, task) {
			scope.config = angular.fromJson(task.input[0].value);
			scope.value = {};
			_.each(scope.config, function (item) {
				if (item.context) {
					scope.value[item.context] = item.value;
				}
			});
		};
		self.updateContext = function (context, scope) {
			_.each(scope.config, function (item) {
				if (item.context) {
					basicsWorkflowUtilityService.setObjectDeep(context, item.context, scope.value[item.context], true);
				}
			});
		};

		/**
		 * Sets default values for user decision ex task when it is opened in the sidebar/popup.
		 */
		self.setDefaultValues = basicsWorkflowUtilityService.setDefaultValuesForUserDecision;
	}

	angular.module('basics.workflow').service(serviceName, ['_', 'basicsWorkflowUtilityService', 'platformDialogService', UserDecisionExAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);

})();
