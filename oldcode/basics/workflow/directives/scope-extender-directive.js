/*globals angular */

(function (angular) {
	'use strict';

	function basicsWorkflowAddGetClerkFn(basicsWorkflowMasterDataService) {
		return {
			restrict: 'A',
			link: function (scope) {
				scope.getCurrentClerk = function () {
					return basicsWorkflowMasterDataService.getCurrentClerk();
				};

			}
		};
	}

	basicsWorkflowAddGetClerkFn.$inject = ['basicsWorkflowMasterDataService'];
	angular.module('basics.workflow')
		.directive('basicsWorkflowAddGetClerkFn', basicsWorkflowAddGetClerkFn);
})(angular);